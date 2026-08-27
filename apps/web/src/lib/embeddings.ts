import { embed, embedMany } from "ai";
import { embeddingModel } from "./openrouter";

export async function generateEmbedding(text: string) {
  const input = text.replaceAll("\n", " ");

  const res = await embed({
    model: embeddingModel,
    value: input,
  });

  return res.embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const input = texts.map((text) => text.replaceAll("\n", " "));

  const res = await embedMany({
    model: embeddingModel,
    values: input,
  });

  return res.embeddings;
}
