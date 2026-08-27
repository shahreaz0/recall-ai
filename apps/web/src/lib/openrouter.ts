import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const model = openrouter.completion("inclusionai/ling-3.0-flash-fin:free");

export const embeddingModel = openrouter.embeddingModel("liquid/lfm-2.5-embedding-350m:free");
