import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

import type { VoiceSettings } from "@/lib/voice-settings";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ai-podcast_${name}`);

export const projectTypeEnum = pgEnum("project_type", [
  "blank",
  "audiobook",
  "article",
  "podcast",
]);

export const projects = createTable(
  "project",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    projectType: projectTypeEnum().default("blank").notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    userId: d.varchar({ length: 255 }).notNull(),
    chaptersOrder: d.uuid().array(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("user_id_idx").on(t.userId), index("name_idx").on(t.name)],
);

export const chapters = createTable("chapter", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  projectId: d
    .uuid()
    .notNull()
    .references(() => projects.id),
  name: d.varchar({ length: 256 }).notNull(),
  blocksOrder: d.uuid().array(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  project: one(projects, {
    fields: [chapters.projectId],
    references: [projects.id],
  }),
  blocks: many(blocks),
}));

export const blocks = createTable("block", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  chapterId: d
    .uuid()
    .notNull()
    .references(() => chapters.id),
  isConverted: d.boolean().default(false).notNull(),
  isLocked: d.boolean().default(false).notNull(),
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [blocks.chapterId],
    references: [chapters.id],
  }),
  children: many(nodes),
}));

export const nodes = createTable("node", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  blockId: d
    .uuid()
    .notNull()
    .references(() => blocks.id),
  text: d.text().notNull(),
  voiceId: d.varchar({ length: 255 }).notNull(),
  voiceSettings: d.jsonb().$type<VoiceSettings>(),
}));
