ALTER TABLE "ai-podcast_subscription" DROP CONSTRAINT "ai-podcast_subscription_user_id_ai-podcast_user_id_fk";
--> statement-breakpoint
ALTER TABLE "ai-podcast_subscription" ADD CONSTRAINT "ai-podcast_subscription_user_id_ai-podcast_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai-podcast_user"("id") ON DELETE no action ON UPDATE no action;