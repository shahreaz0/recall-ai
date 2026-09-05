import { index, pgEnum, snakeCase } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createId } from "@paralleldrive/cuid2";
import { defineRelations } from "drizzle-orm";

export const conversations = snakeCase.table(
  "conversations",
  (c) => ({
    id: c
      .text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: c
      .text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: c.text().notNull(),
    createdAt: c.timestamp().defaultNow().notNull(),
    updatedAt: c
      .timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("conversations_user_id_idx").on(table.userId)],
);

export const roleEnum = pgEnum("role", ["user", "assistant", "system"]);

export const messages = snakeCase.table(
  "messages",
  (c) => ({
    id: c
      .text()
      .$defaultFn(() => createId())
      .primaryKey(),
    conversationId: c
      .text()
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    userId: c
      .text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    content: c.text().notNull().default(""),
    role: roleEnum().notNull(),
    parts: c.jsonb().$type<unknown[]>().default([]),
    reasoning: c.text(),
    resources: c.jsonb().default([]),
    metadata: c.jsonb(),
    createdAt: c.timestamp().defaultNow().notNull(),
    updatedAt: c
      .timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [
    index("messages_conversation_id_idx").on(table.conversationId),
    index("messages_conversation_id_created_at_idx").on(table.conversationId, table.createdAt),
  ],
);

export const conversationRelations = defineRelations({ conversations, messages }, (r) => ({
  conversations: {
    messages: r.many.messages(),
  },
  messages: {
    conversation: r.one.conversations({
      from: r.messages.conversationId,
      to: r.conversations.id,
    }),
  },
}));
