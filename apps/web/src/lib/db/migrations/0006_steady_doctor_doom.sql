CREATE TABLE "ai-podcast_early_access" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"is_early_access" boolean DEFAULT false NOT NULL,
	CONSTRAINT "ai-podcast_early_access_email_unique" UNIQUE("email")
);
