"use client";

import * as React from "react";
import { Collapsible } from "@base-ui/react";
import { ChevronDownIcon, SparklesIcon } from "lucide-react";
import { Streamdown } from "streamdown";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { cn } from "@recall-ai/ui/lib/utils";

const streamdownPlugins = { cjk, code, math, mermaid };

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const context = React.useContext(ReasoningContext);
  if (!context) {
    throw new Error("useReasoning must be used within a Reasoning component");
  }
  return context;
};

export type ReasoningProps = React.ComponentProps<typeof Collapsible.Root> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

export const Reasoning = ({
  isStreaming = false,
  open,
  defaultOpen = true,
  onOpenChange,
  duration,
  className,
  children,
  ...props
}: ReasoningProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [internalDuration, setInternalDuration] = React.useState<number | undefined>(duration);
  const startTimeRef = React.useRef<number | null>(null);
  const prevStreamingRef = React.useRef(isStreaming);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  // Auto-open when streaming starts, auto-close when finished
  React.useEffect(() => {
    if (isStreaming) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      handleOpenChange(true);
    } else if (prevStreamingRef.current && !isStreaming) {
      if (startTimeRef.current) {
        const elapsed = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        setInternalDuration(elapsed);
        startTimeRef.current = null;
      }
      handleOpenChange(false);
    }
    prevStreamingRef.current = isStreaming;
  }, [isStreaming, handleOpenChange]);

  React.useEffect(() => {
    if (duration !== undefined) {
      setInternalDuration(duration);
    }
  }, [duration]);

  const contextValue = React.useMemo<ReasoningContextValue>(
    () => ({
      isStreaming,
      isOpen,
      setIsOpen: handleOpenChange,
      duration: internalDuration,
    }),
    [isStreaming, isOpen, handleOpenChange, internalDuration],
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn("w-full my-1 select-text", className)}
        {...props}
      >
        {children}
      </Collapsible.Root>
    </ReasoningContext.Provider>
  );
};

export type ReasoningTriggerProps = React.ComponentProps<typeof Collapsible.Trigger> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => React.ReactNode;
};

export const ReasoningTrigger = ({
  getThinkingMessage,
  className,
  children,
  ...props
}: ReasoningTriggerProps) => {
  const { isStreaming, isOpen, duration } = useReasoning();

  const defaultMessage = isStreaming
    ? "Thinking..."
    : duration !== undefined
      ? `Thought for ${duration} second${duration === 1 ? "" : "s"}`
      : "Thinking process";

  const message = getThinkingMessage ? getThinkingMessage(isStreaming, duration) : defaultMessage;

  return (
    <Collapsible.Trigger
      className={cn(
        "flex w-full items-center justify-between gap-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground select-none cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {isStreaming ? (
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="size-1.5 rounded-full bg-primary animate-bounce" />
          </span>
        ) : (
          <SparklesIcon className="size-3.5 text-muted-foreground/70" />
        )}
        <span className="font-medium text-xs text-muted-foreground">{children ?? message}</span>
      </div>
      <ChevronDownIcon
        className={cn(
          "size-3.5 text-muted-foreground transition-transform duration-200",
          isOpen ? "rotate-180" : "rotate-0",
        )}
      />
    </Collapsible.Trigger>
  );
};

export type ReasoningContentProps = React.ComponentProps<typeof Collapsible.Panel> & {
  children: string;
};

export const ReasoningContent = ({ children, className, ...props }: ReasoningContentProps) => {
  return (
    <Collapsible.Panel
      className={cn(
        "overflow-hidden text-xs text-muted-foreground border-l-2 border-border/80 pl-3 py-1 my-1.5 leading-relaxed transition-all",
        className,
      )}
      {...props}
    >
      <Streamdown
        plugins={streamdownPlugins}
        className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 font-sans"
      >
        {children}
      </Streamdown>
    </Collapsible.Panel>
  );
};
