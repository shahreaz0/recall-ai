"use client";

import * as React from "react";
import { Loader2, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@recall-ai/ui/components/button";
import { deleteConversation } from "../_chat-actions";
import { useRouter, useSearchParams } from "next/navigation";

type DeleteConversationButtonProps = {
  conversationId: string;
  conversationTitle?: string;
};

export function DeleteConversationButton({
  conversationId,
  conversationTitle,
}: DeleteConversationButtonProps) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        const res = await deleteConversation(conversationId);
        if (res.success) {
          toast.success(
            conversationTitle
              ? `Deleted "${conversationTitle}".`
              : "Conversation deleted successfully.",
          );

          // If the currently open conversation was deleted, remove it from the URL
          const currentCId = searchParams.get("conversationId") || searchParams.get("c");
          if (currentCId === conversationId) {
            const nextParams = new URLSearchParams(searchParams.toString());
            nextParams.delete("conversationId");
            nextParams.delete("c");
            router.push(nextParams.toString() ? `?${nextParams.toString()}` : "/chat");
          }
        } else {
          toast.error(res.error || "Failed to delete conversation.");
        }
      } catch {
        toast.error("Failed to delete conversation. Please try again.");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="icon-xs"
      title="Delete conversation"
      disabled={isPending}
      onClick={handleDelete}
      className="text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
    >
      {isPending ? <Loader2 size={13} className="animate-spin" /> : <TrashIcon size={13} />}
    </Button>
  );
}
