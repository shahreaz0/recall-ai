"use server";
import { generateEmbedding, generateEmbeddings } from "@/lib/embeddings";

import { splitText } from "@/lib/chunking";
import { auth } from "@recall-ai/auth";
import { headers } from "next/headers";

import { extractText } from "unpdf";
import {
  and,
  cosineDistance,
  db,
  desc,
  documentChunks,
  documents,
  eq,
  gt,
  sql,
} from "@recall-ai/db";
import { revalidatePath } from "next/cache";

type CreateDocumentValues = {
  title: string;
  description?: string | undefined;
  file: File;
};

export async function createDocument(formValues: CreateDocumentValues) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized", success: false };
    }

    const file = formValues.file;
    const arrayBuffer = await file.arrayBuffer();

    const { text } = await extractText(new Uint8Array(arrayBuffer), {
      mergePages: true,
    });

    if (!text) {
      return {
        success: false,
        error: "No text found in the document.",
      };
    }

    const chunks = await splitText(text);

    const embeddings = await generateEmbeddings(chunks);

    const res = await db.transaction(async (tx) => {
      const documentRecord = {
        title: formValues.title,
        description: formValues.description,
        userId: session.user.id,
        mimeType: file.type,
        size: file.size,
      };

      const [document] = await tx.insert(documents).values(documentRecord).returning();

      if (!document) {
        return {
          error: "Failed to create document record.",
          success: false,
        };
      }

      const documentChunksRecords = chunks.map((chunk, index) => {
        return {
          content: chunk,
          embedding: embeddings[index],
          chunkIndex: index,
          documentId: document.id,
        };
      });

      await tx.insert(documentChunks).values(documentChunksRecords);

      return { success: true, chunksCount: chunks.length };
    });

    revalidatePath("/chat");
    return res;
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized", success: false };
    }

    const [deletedRecord] = await db
      .delete(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, session.user.id)))
      .returning();

    if (!deletedRecord) {
      return { error: "Document not found or unauthorized", success: false };
    }

    revalidatePath("/chat");

    return { success: true, id: deletedRecord.id };
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function getDocumentList({ query }: { query?: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: "Unauthorized", success: false, documents: [] };
  }

  const docs = await db.query.documents.findMany({
    where: {
      userId: session.user.id,
      title: {
        ilike: query ? `%${query}%` : "%",
      },
    },
  });

  return { success: true, documents: docs };
}

export async function semanticSearchDocument({
  query,
  limit = 5,
  threshold = 0.3,
}: {
  query: string;
  limit?: number;
  threshold?: number;
}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized", success: false, documents: [] };
    }

    const embedding = await generateEmbedding(query);

    console.log(embedding);

    const similarity = sql<number>`1 - (${cosineDistance(documentChunks.embedding, embedding)})`;

    const similarDocs = await db
      .select({
        content: documentChunks.content,
        documentId: documentChunks.documentId,
        chunkIndex: documentChunks.chunkIndex,
        similarity,
      })
      .from(documentChunks)
      .where(gt(similarity, threshold))
      .orderBy((t) => desc(t.similarity))
      .limit(limit);

    console.log(similarDocs);

    // const docs = await db.query.documentChunks.findMany({
    //   where: {
    //     embedding: { l2Distance: { lte: threshold } },
    //     documentId: { in: session.user.id },
    //   },
    //   limit,
    // });

    return {
      success: true,
      documents: similarDocs,
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      success: false,
      documents: [],
    };
  }
}
