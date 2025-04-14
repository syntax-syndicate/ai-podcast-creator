import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/api/trpc";

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
});
