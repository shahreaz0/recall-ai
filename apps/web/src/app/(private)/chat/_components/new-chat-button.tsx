"use client";

import * as React from "react";
import { Loader2, PlusIcon } from "lucide-react";
import { Button } from "@recall-ai/ui/components/button";
import { useRouter } from "next/navigation";
import { createConversation } from "../_actions/conversations";
import { toast } from "sonner";

type NewChatButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "xs" | "lg";
};

export function NewChatButton({ className, variant = "default", size = "sm" }: NewChatButtonProps) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  function handleNewChat() {
    startTransition(async () => {
      try {
        const res = await createConversation({ title: "New Conversation" });
        if (res.success && res.conversation) {
          router.push(`/chat?conversationId=${res.conversation.id}`);
        } else {
          toast.error(res.error || "Failed to create new conversation.");
        }
      } catch {
        toast.error("Failed to create new conversation. Please try again.");
      }
    });
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleNewChat}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <PlusIcon className="size-3.5" />
      )}
      <span>New Chat</span>
    </Button>
  );
}
