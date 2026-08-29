"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { FileTextIcon, UploadCloudIcon, XIcon } from "lucide-react";

import { cn } from "@recall-ai/ui/lib/utils";
import { Button } from "@recall-ai/ui/components/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@recall-ai/ui/components/field";
import { Input } from "@recall-ai/ui/components/input";
import { Textarea } from "@recall-ai/ui/components/textarea";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@recall-ai/ui/components/attachment";
import { createDocument } from "./_chat-actions";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const documentFormSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, "Please upload a document file.")
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 25MB."),
  title: z
    .string()
    .min(2, "Document title must be at least 2 characters.")
    .max(64, "Document title must be at most 64 characters."),
  description: z.string().max(200, "Description must be at most 200 characters.").optional(),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export type AddDocumentFormProps = {
  onSuccess?: (data: DocumentFormValues) => void;
  onCancel?: () => void;
  className?: string;
};

export function AddDocumentForm({ onSuccess, onCancel, className }: AddDocumentFormProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFileSelection = (file: File, onChange: (file: File) => void) => {
    onChange(file);
    if (!form.getValues("title")) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      form.setValue("title", nameWithoutExt, { shouldValidate: true });
    }
  };

  async function handleSubmit(data: DocumentFormValues) {
    try {
      const res = await createDocument(data);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      toast.success(`Document "${data.title}" added successfully.`);
      onSuccess?.(data);
      form.reset();
    } catch {
      toast.error("Failed to add document. Please try again.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
      <Controller
        name="file"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Document File</FieldLabel>
            {field.value ? (
              <Attachment className="w-full justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AttachmentMedia variant="icon">
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{field.value.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {formatBytes(field.value.size)} • {field.value.type || "Document"}
                    </AttachmentDescription>
                  </AttachmentContent>
                </div>
                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => {
                      field.onChange(undefined);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    title="Remove file"
                  >
                    <XIcon size={14} />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files?.[0];
                  if (droppedFile) {
                    handleFileSelection(droppedFile, field.onChange);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 border border-dashed p-6 text-center cursor-pointer transition-colors hover:bg-muted/40",
                  isDragging && "border-primary bg-muted/60",
                  fieldState.invalid && "border-destructive",
                )}
              >
                <UploadCloudIcon className="size-8 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">Click to upload or drag and drop</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Only PDF files are supported (up to 25MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileSelection(selectedFile, field.onChange);
                    }
                  }}
                />
              </div>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g. Project Overview"
              autoComplete="off"
            />
            <FieldDescription>Provide a title for this document.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description (optional)</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Brief summary or notes about this document..."
              className="min-h-20"
            />
            <FieldDescription>
              Optional description to help identify this document.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Uploading..." : "Upload Document"}
        </Button>
      </div>
    </form>
  );
}
