CREATE INDEX "t_token_idx" ON "ai-podcast_session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "ai-podcast_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "ai-podcast_verification" USING btree ("identifier");