import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@recall-ai/env/web";

export const openrouter = createOpenRouter({
  apiKey: env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

export const model = openrouter.chat("inclusionai/ling-3.0-flash-fin:free");

export const embeddingModel = openrouter.textEmbeddingModel("liquid/lfm-2.5-embedding-350m:free");
