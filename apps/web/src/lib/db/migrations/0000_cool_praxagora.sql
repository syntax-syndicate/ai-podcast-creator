CREATE TYPE "public"."project_type_enum" AS ENUM('blank', 'audiobook', 'article', 'podcast');--> statement-breakpoint
CREATE TABLE "ai-podcast_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"is_converted" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_chapter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"blocks_order" uuid[],
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_node" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" uuid NOT NULL,
	"text" text NOT NULL,
	"voice_id" varchar(255) NOT NULL,
	"voice_settings" jsonb
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_type" "project_type_enum" DEFAULT 'blank' NOT NULL,
	"name" varchar(256) NOT NULL,
	"user_id" text NOT NULL,
	"chapters_order" uuid[],
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "ai-podcast_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"username" text,
	"display_username" text,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "ai-podcast_user_email_unique" UNIQUE("email"),
	CONSTRAINT "ai-podcast_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "ai-podcast_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "ai-podcast_account" ADD CONSTRAINT "ai-podcast_account_user_id_ai-podcast_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai-podcast_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai-podcast_block" ADD CONSTRAINT "ai-podcast_block_chapter_id_ai-podcast_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."ai-podcast_chapter"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai-podcast_chapter" ADD CONSTRAINT "ai-podcast_chapter_project_id_ai-podcast_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ai-podcast_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai-podcast_node" ADD CONSTRAINT "ai-podcast_node_block_id_ai-podcast_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."ai-podcast_block"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai-podcast_project" ADD CONSTRAINT "ai-podcast_project_user_id_ai-podcast_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai-podcast_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai-podcast_session" ADD CONSTRAINT "ai-podcast_session_user_id_ai-podcast_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai-podcast_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "ai-podcast_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "ai-podcast_project" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "name_idx" ON "ai-podcast_project" USING btree ("name");--> statement-breakpoint
CREATE INDEX "t_user_id_idx" ON "ai-podcast_session" USING btree ("user_id");