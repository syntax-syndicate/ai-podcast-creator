import { z } from "zod";

import { projectTypes } from "@/lib/constants";

export const createProjectSchema = z
  .object({
    prompt: z.string().optional(),
    files: z
      .array(
        z.object({
          url: z.string().url(),
          mimeType: z.string(),
        }),
      )
      .max(1)
      .optional(),
    searchEnabled: z.boolean().optional(),
    projectType: z.enum(projectTypes),
  })
  .refine(
    (data) =>
      (!!data.prompt &&
        data.prompt.length >= 2 &&
        data.prompt.length <= 1000) ||
      (Array.isArray(data.files) && data.files.length > 0),
    {
      message: "You must provide a prompt, a file, or both",
      path: ["prompt"],
    },
  );
