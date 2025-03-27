"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// import { db } from "@/lib/db";
// import { podcasts } from "@/lib/db/schema";

const createPodcastSchema = z.object({
  prompt: z.string().min(2).max(1000),
  files: z.array(z.instanceof(File)).max(2),
  searchEnabled: z.boolean().default(false),
});

export async function createPodcast(
  input: z.infer<typeof createPodcastSchema>,
) {
  try {
    const { success, data: parsedInput } = createPodcastSchema.safeParse(input);

    if (!success) {
      return {
        data: null,
        error: "Invalid input",
      };
    }

    // const { object } = await generateObject({
    //   model: google("gemini-2.0-flash-001"),
    //   system:
    //     "You are an assistant for generating podcast metadata. " +
    //     "You will be provided with a prompt and a list of files.",
    //   schema: z.object({
    //     title: z.string(),
    //     description: z.string(),
    //   }),
    // });
  } catch (err) {
    return {
      data: null,
    };
  }
}
