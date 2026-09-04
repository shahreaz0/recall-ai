import { FileText, FilesIcon, PlusIcon } from "lucide-react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@recall-ai/ui/components/item";
import { Skeleton } from "@recall-ai/ui/components/skeleton";
import { Button } from "@recall-ai/ui/components/button";
import { getDocumentList } from "../_actions/documents";
import { DeleteDocumentButton } from "./delete-document-button";
import { AddDocumentDialog } from "./add-document-dialog";

type Props = {
  query?: string | undefined;
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  let duration = (d.getTime() - now.getTime()) / 1000;

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return "";
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export async function DocumentList(props: Props) {
  const { documents = [] } = await getDocumentList({ query: props.query });

  if (documents.length === 0) {
    if (props.query) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            No documents found matching &quot;{props.query}&quot;
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border/80 rounded-none bg-muted/20 my-2">
        <div className="p-3 bg-muted/60 mb-3 text-muted-foreground">
          <FilesIcon className="size-6" />
        </div>
        <p className="text-sm font-medium">No documents yet</p>
        <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-[200px]">
          Upload documents to index and search across them in your chats.
        </p>
        <AddDocumentDialog
          trigger={
            <Button size="sm" className="gap-1.5">
              <PlusIcon className="size-3.5" />
              <span>Add Document</span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-280px)]">
      {documents.map((doc) => {
        const formattedDate = formatRelativeTime(doc.createdAt);
        const formattedSize = doc.size ? formatBytes(doc.size) : null;
        const meta = [formattedSize, formattedDate].filter(Boolean).join(" • ");

        return (
          <Item
            key={doc.id}
            variant="muted"
            className="group/item relative flex-nowrap justify-between transition-all duration-150 py-2 px-2.5 hover:bg-muted/60 hover:border-border/60"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <ItemMedia
                variant="icon"
                className="shrink-0 text-muted-foreground group-hover/item:text-foreground"
              >
                <FileText className="size-4" />
              </ItemMedia>
              <ItemContent className="min-w-0 flex-1 overflow-hidden">
                <ItemTitle
                  className="block w-full truncate text-xs text-foreground/90 font-medium"
                  title={doc.title}
                >
                  {doc.title}
                </ItemTitle>
                <ItemDescription className="text-[11px] text-muted-foreground/80 line-clamp-1">
                  {meta || doc.description || "Indexed file"}
                </ItemDescription>
              </ItemContent>
            </div>

            <ItemActions className="shrink-0 ml-2">
              <DeleteDocumentButton documentId={doc.id} documentTitle={doc.title} />
            </ItemActions>
          </Item>
        );
      })}
    </div>
  );
}

export function DocumentListSkeleton() {
  return (
    <div className="space-y-2 py-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2.5 p-2.5 border border-transparent bg-muted/40"
        >
          <Skeleton className="size-4 shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="size-6 shrink-0" />
        </div>
      ))}
    </div>
  );
}

// Retain alias for any existing imports
export const DecumentListSkeleton = DocumentListSkeleton;
