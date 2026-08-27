"use server";

import { auth } from "@recall-ai/auth";
import { db } from "@recall-ai/db";
import { headers } from "next/headers";

export async function getDocuments() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return db.query.documents.findMany({
    where: { userId: session.user.id },
  });
}
