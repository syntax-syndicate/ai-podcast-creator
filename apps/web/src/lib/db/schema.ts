import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

import type { VoiceSettings } from "@/lib/voice-settings";
import { projectTypes, projectStatuses } from "@/lib/constants";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ai-podcast_${name}`);

export const projectTypeEnum = pgEnum("project_type_enum", projectTypes);
export const projectStatusEnum = pgEnum("project_status_enum", projectStatuses);

export const projects = createTable(
  "project",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    projectType: projectTypeEnum().default("blank").notNull(),
    projectStatus: projectStatusEnum().default("generating").notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    userId: d
      .text()
      .notNull()
      .references(() => users.id),
    chaptersOrder: d.uuid().array().default([]).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("user_id_idx").on(t.userId), index("name_idx").on(t.name)],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  chapters: many(chapters),
}));

export const chapters = createTable("chapter", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  projectId: d
    .uuid()
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 256 }).notNull(),
  audioUrl: d.text(),
  blocksOrder: d.uuid().array().default([]).notNull(),
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
  audioUrl: d.text(),
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

export const nodesRelations = relations(nodes, ({ one }) => ({
  block: one(blocks, {
    fields: [nodes.blockId],
    references: [blocks.id],
  }),
}));

// better-auth

export const earlyAccess = createTable(
  "early_access",
  (d) => ({
    id: d.text().primaryKey(),
    email: d.text().notNull().unique(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    isEarlyAccess: d.boolean().notNull().default(false),
  }),
  (t) => [index("early_access_email_idx").on(t.email)],
);

export const users = createTable(
  "user",
  (d) => ({
    id: d.text().primaryKey(),
    name: d.text().notNull(),
    email: d.text().notNull().unique(),
    emailVerified: d.boolean().notNull(),
    username: d.text().unique(),
    displayUsername: d.text(),
    image: d.text(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
  }),
  (t) => [index("user_email_idx").on(t.email)],
);

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
  (t) => [
    index("t_user_id_idx").on(t.userId),
    index("t_token_idx").on(t.token),
  ],
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

export const verifications = createTable(
  "verification",
  (d) => ({
    id: d.text().primaryKey(),
    identifier: d.text().notNull(),
    value: d.text().notNull(),
    expiresAt: d.timestamp().notNull(),
    createdAt: d.timestamp(),
    updatedAt: d.timestamp(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

// types

export type Project = typeof projects.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Block = typeof blocks.$inferSelect;
export type Node = typeof nodes.$inferSelect;
