import { defineRelations } from "drizzle-orm";
import { index, snakeCase } from "drizzle-orm/pg-core";

export const user = snakeCase.table("user", (c) => ({
  id: c.text().primaryKey(),
  name: c.text().notNull(),
  email: c.text().notNull().unique(),
  emailVerified: c.boolean().default(false).notNull(),
  image: c.text(),
  createdAt: c.timestamp().defaultNow().notNull(),
  updatedAt: c
    .timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const session = snakeCase.table(
  "session",
  (c) => ({
    id: c.text().primaryKey(),
    expiresAt: c.timestamp().notNull(),
    token: c.text().notNull().unique(),
    createdAt: c.timestamp().defaultNow().notNull(),
    updatedAt: c
      .timestamp()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: c.text(),
    userAgent: c.text(),
    userId: c
      .text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  }),
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = snakeCase.table(
  "account",
  (c) => ({
    id: c.text().primaryKey(),
    accountId: c.text().notNull(),
    providerId: c.text().notNull(),
    userId: c
      .text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    accessToken: c.text(),
    refreshToken: c.text(),
    idToken: c.text(),
    accessTokenExpiresAt: c.timestamp(),
    refreshTokenExpiresAt: c.timestamp(),
    scope: c.text(),
    password: c.text(),
    createdAt: c.timestamp().defaultNow().notNull(),
    updatedAt: c
      .timestamp()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = snakeCase.table(
  "verification",
  (c) => ({
    id: c.text().primaryKey(),
    identifier: c.text().notNull(),
    value: c.text().notNull(),
    expiresAt: c.timestamp().notNull(),
    createdAt: c.timestamp().defaultNow().notNull(),
    updatedAt: c
      .timestamp()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const authRelations = defineRelations({ user, session, account }, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
}));
