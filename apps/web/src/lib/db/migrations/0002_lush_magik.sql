CREATE TYPE "public"."project_status_enum" AS ENUM('generating', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "ai-podcast_block" ADD COLUMN "audio_url" text;--> statement-breakpoint
ALTER TABLE "ai-podcast_project" ADD COLUMN "project_status" "project_status_enum" DEFAULT 'generating' NOT NULL;