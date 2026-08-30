import { EllipsisIcon } from "lucide-react";

import { AddDocumentDialog } from "./add-document-dialog";
import { DecumentListSkeleton, DocumentList } from "./document-list";
import { Suspense } from "react";
import { SearchDocumentInput } from "./search-document-input";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ChatSidebar(props: Props) {
  return (
    <aside className="w-80 h-80 md:h-full p-4">
      <div className="space-y-4">
        <div>
          <p className="text-xl">Your Resource</p>
          <p className="text-muted-foreground text-xs">4 files | 3mb indexed</p>
        </div>

        <AddDocumentDialog />

        <SearchDocumentInput />
      </div>

      <div className="my-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-semibold tracking-wider">DOCUMENT LIST</p>

        <EllipsisIcon size={16} className="cursor-pointer" />
      </div>

      <Suspense fallback={<DecumentListSkeleton />}>
        {props.searchParams.then((res) => {
          const query = res.query as string | undefined;

          return <DocumentList query={query} />;
        })}
      </Suspense>
    </aside>
  );
}
