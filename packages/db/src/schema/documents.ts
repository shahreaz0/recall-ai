import { index, snakeCase } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { defineRelations } from "drizzle-orm";

export const documents = snakeCase.table("documents", (c) => ({
  id: c.text().primaryKey(),
  title: c.text().notNull(),
  description: c.text(),
  mimeType: c.text().default("application/pdf"),
  size: c.integer().notNull(),
  createdAt: c.timestamp().defaultNow(),
  updatedAt: c
    .timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
  userId: c
    .text()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
}));

export const documentChunks = snakeCase.table(
  "document_chunks",
  (c) => ({
    id: c.text().primaryKey(),
    content: c.text().notNull(),
    embedding: c.vector({ dimensions: 1024 }),
    documentId: c
      .text()
      .references(() => documents.id, { onDelete: "cascade" })
      .notNull(),

    chunkIndex: c.integer().notNull(),
  }),
  (table) => [index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops"))],
);

export const documentRelations = defineRelations({ documents, documentChunks }, (r) => ({
  documents: {
    documentChunks: r.many.documentChunks(),
  },
  documentChunks: {
    document: r.one.documents({
      from: r.documentChunks.documentId,
      to: r.documents.id,
    }),
  },
}));
