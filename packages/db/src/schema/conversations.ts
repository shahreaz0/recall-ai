import { pgEnum, snakeCase } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createId } from "@paralleldrive/cuid2";
import { defineRelations } from "drizzle-orm";

export const conversations = snakeCase.table("conversations", (c) => ({
  id: c.text().primaryKey(),
  userId: c
    .text()
    .references(() => user.id)
    .notNull(),
  title: c.text().notNull(),
  createdAt: c.timestamp().defaultNow().notNull(),
  updatedAt: c
    .timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const roleEnum = pgEnum("role", ["user", "assistant", "system"]);

export const messages = snakeCase.table("messages", (c) => ({
  id: c
    .text()
    .$defaultFn(() => createId())
    .primaryKey(),
  conversationId: c
    .text()
    .references(() => conversations.id)
    .notNull(),
  userId: c
    .text()
    .references(() => user.id)
    .notNull(),
  content: c.text().notNull(),
  role: roleEnum().notNull(),
  reasoning: c.text(),
  resources: c.jsonb().default([]),
  createdAt: c.timestamp().defaultNow().notNull(),
  updatedAt: c
    .timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

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
