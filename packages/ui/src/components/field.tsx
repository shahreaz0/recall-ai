import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@recall-ai/ui/lib/utils";
import { Label } from "@recall-ai/ui/components/label";

const fieldVariants = cva("group/field flex w-full flex-col gap-1.5", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center justify-between gap-4",
      responsive: "flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation, className }))}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="fieldset"
      className={cn("flex flex-col gap-4 border-none p-0 m-0", className)}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(
        variant === "label"
          ? "text-xs font-medium leading-none"
          : "text-sm font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-group" className={cn("flex flex-col gap-3", className)} {...props} />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn("font-medium group-data-[invalid=true]/field:text-destructive", className)}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn("text-xs font-medium leading-none", className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

type FieldErrorProps = React.ComponentProps<"div"> & {
  errors?: Array<string | { message?: string } | undefined | null>;
};

function FieldError({ className, errors, children, ...props }: FieldErrorProps) {
  const errorMessages = errors
    ?.map((err) => (typeof err === "string" ? err : err?.message))
    .filter(Boolean);

  if (!children && (!errorMessages || errorMessages.length === 0)) {
    return null;
  }

  return (
    <div
      data-slot="field-error"
      aria-live="polite"
      className={cn("text-xs font-medium text-destructive space-y-1", className)}
      {...props}
    >
      {children ||
        errorMessages?.map((msg, i) => (
          <p key={i} className="text-xs text-destructive">
            {msg}
          </p>
        ))}
    </div>
  );
}

export {
  Field,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldTitle,
  FieldDescription,
  FieldError,
};
