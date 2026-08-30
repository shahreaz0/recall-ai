import { openrouter } from "@/lib/openrouter";
import { webSearch } from "@exalabs/ai-sdk";
import { env } from "@recall-ai/env/server";

import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

const tools = {
  webSearch: webSearch({ apiKey: env.EXA_API_KEY }),
} as const;

export async function POST(request: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } = await request.json();

  const formettedMessages = await convertToModelMessages(messages);

  const res = await streamText({
    model: openrouter.chat(model),
    messages: formettedMessages,
    tools,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: res.stream,
    }),
  });
}
