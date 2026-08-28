import { Button } from "@recall-ai/ui/components/button";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@recall-ai/ui/components/item";
import { EllipsisIcon, FileIcon, SearchIcon, TrashIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@recall-ai/ui/components/input-group";

const DOCUMENTS = [
  { id: 1, title: "Document 1", description: "Description 1" },
  { id: 2, title: "Document 2", description: "Description 2" },
];

export default function ChatSidebar() {
  return (
    <aside className="w-80 h-80 md:h-full p-4">
      <div className="space-y-4">
        <div>
          <p className="text-xl">Your Resource</p>
          <p className="text-muted-foreground text-xs">4 files | 3mb indexed</p>
        </div>

        <Button className="w-full">Add Documents</Button>

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

      {DOCUMENTS.map((doc) => (
        <Item key={doc.id} variant="muted" className="mt-2">
          <ItemMedia variant="icon">
            <FileIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{doc.title}</ItemTitle>
            <ItemDescription>{doc.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="icon-xs">
              <TrashIcon size={16} />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </aside>
  );
}
