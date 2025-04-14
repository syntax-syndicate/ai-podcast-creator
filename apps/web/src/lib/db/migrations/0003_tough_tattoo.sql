ALTER TABLE "ai-podcast_chapter" ALTER COLUMN "blocks_order" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "ai-podcast_chapter" ALTER COLUMN "blocks_order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ai-podcast_project" ALTER COLUMN "chapters_order" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "ai-podcast_project" ALTER COLUMN "chapters_order" SET NOT NULL;