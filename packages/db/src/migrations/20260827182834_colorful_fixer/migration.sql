CREATE TABLE "documentChunks" (
	"id" text PRIMARY KEY,
	"content" text NOT NULL,
	"embedding" vector(1024),
	"document_id" text NOT NULL,
	"chunk_index" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "content" TO "title";--> statement-breakpoint
ALTER TABLE "documents" RENAME COLUMN "embedding" TO "description";--> statement-breakpoint
DROP INDEX "embeddingIndex";--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "mime_type" text DEFAULT 'application/pdf';--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "size" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
DROP SEQUENCE "documents_id_seq";--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "description" SET DATA TYPE text USING "description"::text;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "documentChunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
ALTER TABLE "documentChunks" ADD CONSTRAINT "documentChunks_document_id_documents_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;