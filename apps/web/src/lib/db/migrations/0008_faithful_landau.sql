CREATE TABLE "ai-podcast_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"status" text NOT NULL,
	"product_id" text NOT NULL,
	"plan" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ai-podcast_subscription" ADD CONSTRAINT "ai-podcast_subscription_user_id_ai-podcast_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ai-podcast_user"("id") ON DELETE cascade ON UPDATE no action;