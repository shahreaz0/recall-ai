import { FileIcon } from "lucide-react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@recall-ai/ui/components/item";
import { Skeleton } from "@recall-ai/ui/components/skeleton";
import { getDocumentList } from "./_chat-actions";
import { DeleteDocumentButton } from "./delete-document-button";

export async function DocumentList() {
  const { documents } = await getDocumentList();

  if (!documents || documents.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">No documents found.</div>
    );
  }

  return (
    <section className="space-y-2">
      {documents.map((doc) => (
        <Item key={doc.id} variant="muted" className="flex-nowrap justify-between">
          <ItemMedia variant="icon" className="shrink-0">
            <FileIcon />
          </ItemMedia>
          <ItemContent className="min-w-0 flex-1 overflow-hidden">
            <ItemTitle className="block w-full truncate" title={doc.title}>
              {doc.title}
            </ItemTitle>
            {doc.description ? (
              <ItemDescription className="block w-full truncate" title={doc.description}>
                {doc.description}
              </ItemDescription>
            ) : null}
          </ItemContent>
          <ItemActions className="shrink-0">
            <DeleteDocumentButton documentId={doc.id} documentTitle={doc.title} />
          </ItemActions>
        </Item>
      ))}
    </section>
  );
}

export function DecumentListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}
