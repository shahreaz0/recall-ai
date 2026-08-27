import { neon } from "@neondatabase/serverless";
import { env } from "@recall-ai/env/server";
import { defineRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const relations = defineRelations(schema);

export function createDb() {
  const sql = neon(env.DATABASE_URL);

  return drizzle({ client: sql, relations });
}

export const db = createDb();
export * from "./schema";
