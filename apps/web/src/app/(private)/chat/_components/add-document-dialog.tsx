"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@recall-ai/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@recall-ai/ui/components/dialog";
import { AddDocumentForm, type DocumentFormValues } from "./add-document-form";

type AddDocumentDialogProps = {
  onDocumentAdded?: (doc: DocumentFormValues) => void;
  trigger?: React.ReactNode;
};

export function AddDocumentDialog({ trigger }: AddDocumentDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button className="w-full gap-2">
              <PlusIcon size={16} />
              Add Documents
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Upload and index a new file into your knowledge base.
          </DialogDescription>
        </DialogHeader>

        <AddDocumentForm
          onSuccess={() => {
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
