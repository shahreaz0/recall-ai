"use client";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@recall-ai/ui/components/ai-elements/attachments";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  usePromptInputAttachments,
} from "@recall-ai/ui/components/ai-elements/prompt-input";
import { BotIcon, GlobeIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@recall-ai/ui/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@recall-ai/ui/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@recall-ai/ui/components/ai-elements/reasoning";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const models = [
  { id: "openrouter/auto", name: "Auto" },
  { id: "inclusionai/ling-3.0-flash-fin:free", name: "Ling 3.0 Flash Fin" },
  { id: "z-ai/glm-5.2:free", name: "GLM 5.2" },
];

function MessageLoading({ label = "Thinking..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground select-none">
      <div className="flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-primary/80 animate-bounce [animation-delay:-0.3s]" />
        <span className="size-1.5 rounded-full bg-primary/80 animate-bounce [animation-delay:-0.15s]" />
        <span className="size-1.5 rounded-full bg-primary/80 animate-bounce" />
      </div>
      <span className="text-xs text-muted-foreground font-medium animate-pulse">{label}</span>
    </div>
  );
}

export function Chat() {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);

  const { messages, status, sendMessage, stop } = useChat();

  const isGenerating = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const isWaitingForAssistant = isGenerating && (!lastMessage || lastMessage.role === "user");

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: useWebSearch,
        },
      },
    );
    setText("");
  };

  console.log(messages);

  return (
    <div className="max-w-3xl size-full mx-auto">
      <div className="flex flex-col h-full">
        <Conversation className="max-h-[calc(100dvh-200px)]">
          <ConversationContent>
            {messages.length === 0 && (
              <ConversationEmptyState
                icon={<BotIcon className="size-8 text-muted-foreground/50" />}
                title="Ask Recall AI"
                description="Ask questions about your uploaded documents or search across your indexed knowledge base."
              />
            )}

            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isAssistant = message.role === "assistant";

              // Consolidate all reasoning parts into one block
              const reasoningParts = message.parts.filter(
                (part): part is { type: "reasoning"; text: string } =>
                  part.type === "reasoning" && Boolean((part as { text?: string }).text),
              );
              const reasoningText = reasoningParts.map((part) => part.text).join("\n\n");
              const hasReasoning = reasoningParts.length > 0;

              // Check if reasoning is still streaming (last part is reasoning on last message)
              const lastPart = message.parts.at(-1);
              const isReasoningStreaming =
                isLastMessage && status === "streaming" && lastPart?.type === "reasoning";

              const hasVisibleText = message.parts.some(
                (part) => part.type === "text" && part.text && part.text.length > 0,
              );
              const isAssistantWaiting =
                isAssistant && isLastMessage && isGenerating && !hasVisibleText && !hasReasoning;

              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {hasReasoning && (
                      <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
                        <ReasoningTrigger />
                        <ReasoningContent>{reasoningText}</ReasoningContent>
                      </Reasoning>
                    )}

                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <MessageResponse key={`${message.id}-${i}`}>
                              {part.text}
                            </MessageResponse>
                          );
                        case "reasoning":
                          // Handled by consolidated Reasoning component above
                          return null;
                        default:
                          if (part.type === "dynamic-tool" || part.type.startsWith("tool-")) {
                            const toolName =
                              part.type === "dynamic-tool"
                                ? (part as { toolName?: string }).toolName
                                : part.type.replace(/^tool-/, "");
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="flex items-center gap-2 py-1 text-xs text-muted-foreground select-none"
                              >
                                <Loader2 className="size-3.5 animate-spin text-primary shrink-0" />
                                <span>
                                  {toolName === "searchKnowledgeBase"
                                    ? "Searching knowledge base..."
                                    : `Using ${toolName}...`}
                                </span>
                              </div>
                            );
                          }
                          return null;
                      }
                    })}

                    {isAssistantWaiting && (
                      <MessageLoading
                        label={status === "submitted" ? "Thinking..." : "Generating response..."}
                      />
                    )}
                  </MessageContent>
                </Message>
              );
            })}

            {isWaitingForAssistant && (
              <Message from="assistant" key="pending-assistant-loading">
                <MessageContent>
                  <MessageLoading
                    label={status === "submitted" ? "Thinking..." : "Generating response..."}
                  />
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea onChange={(e) => setText(e.target.value)} value={text} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                tooltip={{ content: "Search the web", shortcut: "⌘K" }}
                variant={useWebSearch ? "default" : "ghost"}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value as string);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((model) => (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit
              className="bg-primary"
              disabled={!text && !status}
              status={status}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
