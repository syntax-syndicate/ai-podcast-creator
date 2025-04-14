import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/api/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { env } from "@/env";
import { db } from "@/lib/db";
import { blocks } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";

export const blockRouter = createTRPCRouter({
  generateSpeech: protectedProcedure
    .input(
      z.object({
        blockId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const block = await db.query.blocks.findFirst({
        where: (table, { eq }) => eq(table.id, input.blockId),
        with: {
          children: true,
          chapter: {
            columns: {},
            with: {
              project: {
                columns: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!block) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Block not found",
        });
      }

      if (block.chapter.project.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this block",
        });
      }

      // parallel fetch
      const bufferPromises = block.children.map(async (node) => {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${node.voiceId}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": env.XI_API_KEY,
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text: node.text,
              model_id: "eleven_flash_v2_5",
              voice_settings: node.voiceSettings ?? undefined,
            }),
          },
        );

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate speech",
          });
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      });

      const buffers = await Promise.all(bufferPromises);
      const combinedBuffer = Buffer.concat(buffers);
      const filename = `${block.id}_${new Date().toISOString()}.mp3`;
      const file = new File([combinedBuffer], filename, { type: "audio/mpeg" });

      const { data, error } = await utapi.uploadFiles(file);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        });
      }

      await db
        .update(blocks)
        .set({
          audioUrl: data.ufsUrl,
          isConverted: true,
        })
        .where(eq(blocks.id, block.id));

      return {
        audioUrl: data.ufsUrl,
      };
    }),
});
