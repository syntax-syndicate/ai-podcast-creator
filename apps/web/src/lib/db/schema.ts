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

export const projectTypeEnum = pgEnum("project_type_enum", [
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
    userId: d
      .text()
      .notNull()
      .references(() => users.id),
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
    .references(() => projects.id, { onDelete: "cascade" }),
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
    .references(() => blocks.id, { onDelete: "cascade" }),
  text: d.text().notNull(),
  voiceId: d.varchar({ length: 255 }).notNull(),
  voiceSettings: d.jsonb().$type<VoiceSettings>(),
}));

// better-auth

export const users = createTable("user", (d) => ({
  id: d.text().primaryKey(),
  name: d.text().notNull(),
  email: d.text().notNull().unique(),
  emailVerified: d.boolean().notNull(),
  username: d.text().unique(),
  displayUsername: d.text(),
  image: d.text(),
  createdAt: d.timestamp().notNull(),
  updatedAt: d.timestamp().notNull(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    id: d.text().primaryKey(),
    expiresAt: d.timestamp().notNull(),
    token: d.text().notNull().unique(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
    ipAddress: d.text(),
    userAgent: d.text(),
    userId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const accounts = createTable(
  "account",
  (d) => ({
    id: d.text().primaryKey(),
    accountId: d.text().notNull(),
    providerId: d.text().notNull(),
    userId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: d.text(),
    refreshToken: d.text(),
    idToken: d.text(),
    accessTokenExpiresAt: d.timestamp(),
    refreshTokenExpiresAt: d.timestamp(),
    scope: d.text(),
    password: d.text(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verifications = createTable("verification", (d) => ({
  id: d.text().primaryKey(),
  identifier: d.text().notNull(),
  value: d.text().notNull(),
  expiresAt: d.timestamp().notNull(),
  createdAt: d.timestamp(),
  updatedAt: d.timestamp(),
}));
