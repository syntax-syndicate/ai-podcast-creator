import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/trpc/api/trpc";
import { chapters, projects } from "@/lib/db/schema";
import { utapi } from "@/lib/uploadthing";
import { qstash } from "@/lib/qstash";
import { absoluteUrl, capitalize } from "@/lib/utils";
import { createProjectSchema } from "@/lib/validations";

export const projectRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.projects.findMany({
        where: (table, { and, eq, ilike }) => {
          const conditions = [eq(table.userId, ctx.session.user.id)];
          if (input?.search) {
            conditions.push(ilike(table.name, `%${input.search}%`));
          }
          return and(...conditions);
        },
        with: {
          chapters: {
            columns: {
              id: true,
              audioUrl: true,
            },
          },
        },
        orderBy: (table, { desc }) => desc(table.updatedAt),
      });
    }),

  getById: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: (table, { eq }) => eq(table.id, input.projectId),
      });

      if (project?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to access this project",
        });
      }

      return project;
    }),

  getChaptersOrder: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: (table, { eq }) => eq(table.id, input.projectId),
        columns: {
          userId: true,
          chaptersOrder: true,
        },
      });

      if (project?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to access this project",
        });
      }

      return project;
    }),

  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      // database transaction
      const { project, chapter } = await ctx.db.transaction(async (tx) => {
        const [project] = await ctx.db
          .insert(projects)
          .values({
            name: `${capitalize(input.projectType)} project`,
            userId: ctx.session.user.id,
            projectType: input.projectType,
          })
          .returning();

        if (!project) {
          tx.rollback();

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const [chapter] = await tx
          .insert(chapters)
          .values({
            projectId: project.id,
            name: "Chapter 1",
          })
          .returning();

        if (!chapter) {
          tx.rollback();

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        await tx
          .update(projects)
          .set({
            chaptersOrder: [chapter.id],
          })
          .where(eq(projects.id, project.id));

        return { project, chapter };
      });

      // queue script generation
      const queue = qstash.queue({
        queueName: `project_${project.id}_script`,
      });

      await queue.enqueueJSON({
        url: absoluteUrl(
          `/api/project/${project.id}/chapter/${chapter.id}/generate-script`,
        ),
        body: {
          prompt: input.prompt,
          files: input.files,
          searchEnabled: input.searchEnabled,
          projectType: input.projectType,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(projects)
        .set({})
        .where(eq(projects.id, input.projectId));
    }),
});
