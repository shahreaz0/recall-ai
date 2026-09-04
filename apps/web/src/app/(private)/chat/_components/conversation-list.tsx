import { MessageSquare, MessagesSquare } from "lucide-react";
import Link from "next/link";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@recall-ai/ui/components/item";
import { Skeleton } from "@recall-ai/ui/components/skeleton";
import { getConversationsList } from "../_actions/conversations";
import { DeleteConversationButton } from "./delete-conversation-button";
import { NewChatButton } from "./new-chat-button";
import { cn } from "@recall-ai/ui/lib/utils";

type Props = {
  query?: string | undefined;
  activeConversationId?: string | undefined;
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

export async function ConversationList({ query, activeConversationId }: Props) {
  const { conversations = [] } = await getConversationsList({ query });

  if (conversations.length === 0) {
    if (query) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            No conversations found matching &quot;{query}&quot;
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border/80 rounded-none bg-muted/20 my-2">
        <div className="p-3 bg-muted/60 mb-3 text-muted-foreground">
          <MessagesSquare className="size-6" />
        </div>
        <p className="text-sm font-medium">No conversations yet</p>
        <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-50">
          Start a new chat to ask questions and explore your indexed documents.
        </p>
        <NewChatButton size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 max-h-[calc(100vh-280px)]">
      {conversations.map((conv) => {
        const isActive = activeConversationId === conv.id;
        const formattedDate = formatRelativeTime(conv.updatedAt || conv.createdAt);

        return (
          <Item
            key={conv.id}
            variant={isActive ? "outline" : "muted"}
            className={cn(
              "group/item relative flex-nowrap justify-between transition-all duration-150 py-2 px-2.5",
              isActive
                ? "border-primary/60 bg-muted/80 shadow-xs"
                : "hover:bg-muted/60 hover:border-border/60",
            )}
          >
            <Link
              href={`/chat?conversationId=${conv.id}`}
              className="flex min-w-0 flex-1 items-center gap-2.5 outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ItemMedia
                variant="icon"
                className={cn(
                  "shrink-0",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover/item:text-foreground",
                )}
              >
                <MessageSquare className="size-4" />
              </ItemMedia>
              <ItemContent className="min-w-0 flex-1 overflow-hidden">
                <ItemTitle
                  className={cn(
                    "block w-full truncate text-xs",
                    isActive ? "font-semibold text-foreground" : "text-foreground/90",
                  )}
                  title={conv.title}
                >
                  {conv.title}
                </ItemTitle>
                <ItemDescription className="text-[11px] text-muted-foreground/80 line-clamp-1">
                  {formattedDate}
                </ItemDescription>
              </ItemContent>
            </Link>

            <ItemActions className="shrink-0 ml-2">
              <DeleteConversationButton conversationId={conv.id} conversationTitle={conv.title} />
            </ItemActions>
          </Item>
        );
      })}
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="space-y-2 py-1">
      {Array.from({ length: 5 }).map((_, index) => (
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
