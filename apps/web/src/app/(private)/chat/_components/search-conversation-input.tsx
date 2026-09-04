"use client";

import { Loader2, SearchIcon, XIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@recall-ai/ui/components/input-group";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@recall-ai/ui/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchConversationInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("c_query") ?? "";

  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialValue);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const currentParam = searchParams.get("c_query") ?? "";
    if (debouncedQuery === currentParam) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery.trim()) {
      params.set("c_query", debouncedQuery.trim());
    } else {
      params.delete("c_query");
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "/chat");
    });
  }, [debouncedQuery, router, searchParams]);

  return (
    <InputGroup className="w-full">
      <InputGroupInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search conversations..."
      />
      <InputGroupAddon>
        {isPending ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            title="Clear search"
          >
            <XIcon className="size-3.5" />
          </button>
        ) : (
          <SearchIcon className="size-4 text-muted-foreground" />
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
