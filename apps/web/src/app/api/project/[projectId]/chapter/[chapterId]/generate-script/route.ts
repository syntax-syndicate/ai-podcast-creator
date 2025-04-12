import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { withTracing } from "@posthog/ai";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { generateObject, type FilePart, type TextPart } from "ai";
import { PostHog } from "posthog-node";
import { z } from "zod";

import { env } from "@/env";
import { db } from "@/lib/db";
import { ProjectType } from "@/lib/constants";
import { defaultVoiceIds } from "@/lib/voice-settings";
import { blocks, nodes, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = Promise<{ projectId: string; chapterId: string }>;

export const POST = verifySignatureAppRouter(
  // @ts-expect-error upstash types are not updated
  async (req, { params }: { params: Params }) => {
    try {
      const { projectId, chapterId } = await params;

      const { prompt, files, searchEnabled, projectType } =
        (await req.json()) as {
          prompt?: string;
          files?: { url: string; mimeType: string }[];
          searchEnabled: boolean;
          projectType: ProjectType;
        };

      const fileParts: FilePart[] =
        Array.isArray(files) && files.length > 0
          ? files?.map((file) => ({
              type: "file",
              data: file.url,
              mimeType: file.mimeType,
            }))
          : [];

      const textParts: TextPart[] = !!prompt
        ? [
            {
              type: "text",
              text: prompt,
            },
          ]
        : [];

      const posthog = new PostHog(env.POSTHOG_API_KEY, {
        host: "https://eu.i.posthog.com",
      });

      const google = createGoogleGenerativeAI();
      const model = withTracing(
        google("gemini-2.0-flash-001", {
          useSearchGrounding: searchEnabled,
        }),
        posthog,
        {
          posthogTraceId: `${projectId}_${chapterId}`,
        },
      );

      const { object } = await generateObject({
        model,
        output: "array",
        schema: z.object({
          speaker: z.enum(["1", "2"]),
          text: z.string(),
        }),
        messages: [
          {
            role: "system",
            content: [
              "You are an expert Podcast Script Generator specializing in creating engaging, focused conversations based on provided materials.",
              "Generate a conversational script between two distinct speakers (Speaker 1 and Speaker 2) based solely on the information contained within the user's prompt and/or any attached files.",
              "Analyze the user's request details and any attached files thoroughly.",
              "Synthesize information only from these provided sources" +
                (searchEnabled
                  ? ". You may also use search to find additional relevant information."
                  : ". Do not introduce external knowledge or topics."),
              "Format your response as a script featuring a natural-sounding dialogue.",
              "The conversation must comprehensively cover the key aspects of the topic derived from the input.",
              "Ensure the dialogue flows logically, with speakers potentially building on each other's points or offering complementary perspectives (as supported by the input).",
              "Maintain a conversational tone appropriate for a podcast discussion segment.",
              "Stick strictly to the topic defined by the input prompt and/or files. Avoid tangents or unrelated information.",
              "Do NOT include: Podcast intros/outros, Show names or episode titles, Host names or personal introductions, Advertisements or sponsor messages, Sound effect cues, Any information not directly present or reasonably inferred from the provided input.",
            ].join("\n"),
          },
          {
            role: "user",
            content: [...textParts, ...fileParts],
          },
        ],
      });

      await db.transaction(async (tx) => {
        for (const { speaker, text } of object) {
          const voiceIds = {
            1: defaultVoiceIds.chris,
            2: defaultVoiceIds.jessica,
          };

          const [block] = await tx
            .insert(blocks)
            .values({
              chapterId,
            })
            .returning();

          if (!block) {
            tx.rollback();
            throw new Error("Failed to create a block");
          }

          const [node] = await tx
            .insert(nodes)
            .values({
              blockId: block.id,
              text,
              voiceId: voiceIds[speaker],
            })
            .returning();

          if (!node) {
            tx.rollback();
            throw new Error("Failed to create a node");
          }
        }

        await tx
          .update(projects)
          .set({
            projectStatus: "completed",
          })
          .where(eq(projects.id, projectId));
      });

      // clean up
      await posthog.shutdown();

      return new Response(null, { status: 201 });
    } catch (err) {
      console.error(err);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
);
