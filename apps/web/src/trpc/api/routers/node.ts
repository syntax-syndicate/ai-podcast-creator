import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { nodes } from "@/lib/db/schema";
import { voiceSettingsSchema } from "@/lib/voice-settings";
import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";

export const nodeRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        text: z.string().optional(),
        voiceId: z.string().optional(),
        voiceSettings: voiceSettingsSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const node = await ctx.db.query.nodes.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
        with: {
          block: {
            columns: {},
            with: {
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
          },
        },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      if (node.block.chapter.project.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this node",
        });
      }

      return await ctx.db
        .update(nodes)
        .set({
          text: input.text,
          voiceId: input.voiceId,
          voiceSettings: input.voiceSettings,
        })
        .where(eq(nodes.id, input.id))
        .returning();
    }),
});
