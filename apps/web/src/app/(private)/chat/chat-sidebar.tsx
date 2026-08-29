import { EllipsisIcon, SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@recall-ai/ui/components/input-group";

import { AddDocumentDialog } from "./add-document-dialog";
import { DecumentListSkeleton, DocumentList } from "./document-list";
import { Suspense } from "react";

export default function ChatSidebar() {
  return (
    <aside className="w-80 h-80 md:h-full p-4">
      <div className="space-y-4">
        <div>
          <p className="text-xl">Your Resource</p>
          <p className="text-muted-foreground text-xs">4 files | 3mb indexed</p>
        </div>

        <AddDocumentDialog />

        <InputGroup className="w-full">
          <InputGroupInput placeholder="Search documents..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="my-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-semibold tracking-wider">DOCUMENT LIST</p>

        <EllipsisIcon size={16} className="cursor-pointer" />
      </div>

      <Suspense fallback={<DecumentListSkeleton />}>
        <DocumentList />
      </Suspense>
    </aside>
  );
}
