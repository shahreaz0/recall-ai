import { Suspense } from "react";
import { MessagesSquare } from "lucide-react";

import { ConversationList, ConversationListSkeleton } from "./conversation-list";
import { NewChatButton } from "./new-chat-button";
import { SearchConversationInput } from "./search-conversation-input";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function Conversations(props: Props) {
  const searchParams = await props.searchParams;
  const conversationQuery =
    typeof searchParams.c_query === "string" ? searchParams.c_query : undefined;
  const activeConversationId =
    typeof searchParams.conversationId === "string"
      ? searchParams.conversationId
      : typeof searchParams.c === "string"
        ? searchParams.c
        : undefined;

  return (
    <aside className="w-80 h-80 md:h-full p-4 flex flex-col shrink-0">
      <div className="space-y-4">
        <div>
          <p className="text-xl">Conversations</p>
          <p className="text-muted-foreground text-xs">Chat history & context</p>
        </div>

        <NewChatButton className="w-full justify-center" />

        <SearchConversationInput />
      </div>

      <div className="my-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-semibold tracking-wider">RECENT CHATS</p>

        <MessagesSquare className="size-4 text-muted-foreground" />
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <Suspense fallback={<ConversationListSkeleton />}>
          <ConversationList query={conversationQuery} activeConversationId={activeConversationId} />
        </Suspense>
      </div>
    </aside>
  );
}
