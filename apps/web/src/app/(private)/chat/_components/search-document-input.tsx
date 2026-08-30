"use client";

import { Loader2, SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@recall-ai/ui/components/input-group";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@recall-ai/ui/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchDocumentInput() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [debouncedQuery]);

  return (
    <InputGroup className="w-full">
      <InputGroupInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents..."
      />
      <InputGroupAddon>
        {isPending ? <Loader2 className="animate-spin" /> : <SearchIcon />}
      </InputGroupAddon>
    </InputGroup>
  );
}
