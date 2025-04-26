import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/api/trpc";
import { utapi } from "@/lib/uploadthing";
import { chapters } from "@/lib/db/schema";

export const chapterRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chapter = await ctx.db.query.chapters.findFirst({
        where: (table, { eq }) => eq(table.id, input.chapterId),
        with: {
          project: {
            columns: {
              userId: true,
            },
          },
          blocks: {
            with: {
              children: true,
            },
          },
        },
      });

      if (chapter?.project.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to access this chapter",
        });
      }

      return chapter;
    }),

  exportAudio: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.db.query.chapters.findFirst({
        where: (table, { eq }) => eq(table.id, input.chapterId),
        with: {
          project: {
            columns: {
              userId: true,
            },
          },
          blocks: {
            columns: {
              audioUrl: true,
            },
          },
        },
      });

      if (chapter?.project.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to access this chapter",
        });
      }

      if (chapter?.blocks.some((block) => !block.audioUrl)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not all blocks have been converted to audio",
        });
      }

      const promises = chapter.blocks.map(async (block) => {
        const response = await fetch(block.audioUrl as string, {
          headers: {
            Accept: "audio/mpeg",
          },
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch audio",
          });
        }

        return Buffer.from(await response.arrayBuffer());
      });

      const buffers = await Promise.all(promises);
      const combinedBuffer = Buffer.concat(buffers);
      const filename = `${chapter.id}_${new Date().toISOString()}.mp3`;
      const file = new File([combinedBuffer], filename, { type: "audio/mpeg" });

      const { data, error } = await utapi.uploadFiles(file);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        });
      }

      await ctx.db
        .update(chapters)
        .set({
          audioUrl: data.ufsUrl,
        })
        .where(eq(chapters.id, input.chapterId));

      return { audioUrl: data.ufsUrl, filename };
    }),
});
