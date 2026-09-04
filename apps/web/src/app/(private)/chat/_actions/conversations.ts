"use server";

import { auth } from "@recall-ai/auth";
import { and, conversations, db, desc, eq, ilike, messages } from "@recall-ai/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getConversationsList({ query }: { query?: string } = {}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized", success: false, conversations: [] };
    }

    const convs = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.userId, session.user.id),
          query ? ilike(conversations.title, `%${query}%`) : undefined,
        ),
      )
      .orderBy(desc(conversations.updatedAt));

    return { success: true, conversations: convs };
  } catch (error) {
    return {
      error: (error as Error).message,
      success: false,
      conversations: [],
    };
  }
}

export async function createConversation({ title }: { title?: string } = {}) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized", success: false };
    }

    const [newConv] = await db
      .insert(conversations)
      .values({
        userId: session.user.id,
        title: title?.trim() || "New Chat",
      })
      .returning();

    revalidatePath("/chat");
    return { success: true, conversation: newConv };
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized", success: false };
    }

    const [deletedRecord] = await db.transaction(async (tx) => {
      await tx.delete(messages).where(eq(messages.conversationId, conversationId));
      return await tx
        .delete(conversations)
        .where(and(eq(conversations.id, conversationId), eq(conversations.userId, session.user.id)))
        .returning();
    });

    if (!deletedRecord) {
      return { error: "Conversation not found or unauthorized", success: false };
    }

    revalidatePath("/chat");
    return { success: true, id: deletedRecord.id };
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}
