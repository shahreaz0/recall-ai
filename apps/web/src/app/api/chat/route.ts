import { semanticSearchDocument } from "@/app/(private)/chat/_chat-actions";
import { openrouter } from "@/lib/openrouter";
// import { webSearch } from "@exalabs/ai-sdk";
// import { env } from "@recall-ai/env/server";

import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import z from "zod";

const searchKnowledgeBase = tool({
  description:
    "Search the user's uploaded documents and knowledge base for relevant context and information using semantic search. Use this whenever answering questions related to uploaded files or personal knowledge.",
  inputSchema: z.object({ query: z.string() }),
  async execute({ query }) {
    const results = await semanticSearchDocument({ query });

    console.log(results);

    if (results.documents.length === 0) return "No similar docs found";

    const documents = results.documents.map((d) => d.content).join("\n");

    return `Context: ${documents}\n\nAnswer the question based on the context: ${query}`;
  },
});

const tools = {
  // webSearch: webSearch({ apiKey: env.EXA_API_KEY }),
  searchKnowledgeBase,
} as const;

export async function POST(request: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } = await request.json();

  const formettedMessages = await convertToModelMessages(messages);

  const res = await streamText({
    model: openrouter.chat(model),
    messages: formettedMessages,
    tools,
    stopWhen: stepCountIs(3),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: res.stream,
    }),
  });
}
