ALTER TABLE "messages" ADD COLUMN "parts" jsonb DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "content" SET DEFAULT '';--> statement-breakpoint
CREATE INDEX "conversations_user_id_idx" ON "conversations" ("user_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages" ("conversation_id","created_at");--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_user_id_user_id_fkey", ADD CONSTRAINT "conversations_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversation_id_conversations_id_fkey", ADD CONSTRAINT "messages_conversation_id_conversations_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_user_id_fkey", ADD CONSTRAINT "messages_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;