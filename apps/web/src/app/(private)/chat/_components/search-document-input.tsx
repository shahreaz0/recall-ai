"use client";

import { Loader2, SearchIcon, XIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@recall-ai/ui/components/input-group";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@recall-ai/ui/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchDocumentInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("query") ?? "";

  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialValue);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const currentParam = searchParams.get("query") ?? "";
    if (debouncedQuery === currentParam) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery.trim()) {
      params.set("query", debouncedQuery.trim());
    } else {
      params.delete("query");
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "/chat");
    });
  }, [debouncedQuery, router, searchParams]);

  return (
    <InputGroup className="w-full">
      <InputGroupAddon align="inline-start">
        <SearchIcon className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents..."
      />
      {(isPending || query) && (
        <InputGroupAddon align="inline-end">
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={() => setQuery("")}
              title="Clear search"
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
