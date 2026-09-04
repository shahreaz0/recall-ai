"use client";

import * as React from "react";
import { Loader2, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@recall-ai/ui/components/button";
import { deleteDocument } from "../_actions/documents";

type DeleteDocumentButtonProps = {
  documentId: string;
  documentTitle?: string;
};

export function DeleteDocumentButton({ documentId, documentTitle }: DeleteDocumentButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        const res = await deleteDocument(documentId);
        if (res.success) {
          toast.success(
            documentTitle
              ? `Document "${documentTitle}" deleted.`
              : "Document deleted successfully.",
          );
        } else {
          toast.error(res.error || "Failed to delete document.");
        }
      } catch {
        toast.error("Failed to delete document. Please try again.");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="icon-xs"
      title="Delete document"
      disabled={isPending}
      onClick={handleDelete}
      className="text-muted-foreground hover:text-destructive transition-colors"
    >
      {isPending ? <Loader2 size={13} className="animate-spin" /> : <TrashIcon size={13} />}
    </Button>
  );
}
