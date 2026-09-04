import { Suspense } from "react";
import { FilesIcon } from "lucide-react";

import { AddDocumentDialog } from "./add-document-dialog";
import { DocumentList, DocumentListSkeleton } from "./document-list";
import { SearchDocumentInput } from "./search-document-input";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function DocumentsManager(props: Props) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams.query === "string" ? searchParams.query : undefined;

  return (
    <aside className="w-80 h-80 md:h-full p-4 flex flex-col shrink-0">
      <div className="space-y-4">
        <div>
          <p className="text-xl">Your Resources</p>
          <p className="text-muted-foreground text-xs">Indexed knowledge & documents</p>
        </div>

        <AddDocumentDialog />

        <SearchDocumentInput />
      </div>

      <div className="my-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-semibold tracking-wider">DOCUMENT LIST</p>

        <FilesIcon className="size-4 text-muted-foreground" />
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <Suspense fallback={<DocumentListSkeleton />}>
          <DocumentList query={query} />
        </Suspense>
      </div>
    </aside>
  );
}
