import { Pool, neonConfig } from "@neondatabase/serverless";
import { env } from "@recall-ai/env/server";
import { defineRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

export const relations = defineRelations(schema);

export function createDb() {
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  return drizzle({ client: pool, relations });
}

export const db = createDb();
export * from "./schema";
export * from "drizzle-orm";
