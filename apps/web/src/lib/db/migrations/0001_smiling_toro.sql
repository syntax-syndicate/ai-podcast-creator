ALTER TABLE "ai-podcast_chapter" DROP CONSTRAINT "ai-podcast_chapter_project_id_ai-podcast_project_id_fk";
--> statement-breakpoint
ALTER TABLE "ai-podcast_node" DROP CONSTRAINT "ai-podcast_node_block_id_ai-podcast_block_id_fk";
--> statement-breakpoint
ALTER TABLE "ai-podcast_chapter" ADD CONSTRAINT "ai-podcast_chapter_project_id_ai-podcast_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."ai-podcast_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai-podcast_node" ADD CONSTRAINT "ai-podcast_node_block_id_ai-podcast_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."ai-podcast_block"("id") ON DELETE cascade ON UPDATE no action;