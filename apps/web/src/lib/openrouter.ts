import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@recall-ai/env/server";

export const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const embeddingModel = openrouter.textEmbeddingModel("liquid/lfm-2.5-embedding-350m:free");
