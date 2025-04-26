import { blockRouter } from "@/trpc/api/routers/block";
import { chapterRouter } from "@/trpc/api/routers/chapter";
import { nodeRouter } from "@/trpc/api/routers/node";
import { projectRouter } from "@/trpc/api/routers/project";
import { createCallerFactory, createTRPCRouter } from "@/trpc/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  chapter: chapterRouter,
  block: blockRouter,
  node: nodeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
