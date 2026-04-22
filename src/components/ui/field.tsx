"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type FieldOrientation = "vertical" | "horizontal";

type FieldContextValue = {
  id: string;
  descriptionId: string;
  errorId: string;
  hasError: boolean;
  orientation: FieldOrientation;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldContext() {
  const ctx = React.useContext(FieldContext);

  if (!ctx) {
    throw new Error("Field subcomponents must be used inside <Field>.");
  }

  return ctx;
}

type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: FieldOrientation;
  invalid?: boolean;
  fieldId?: string;
};

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    { className, orientation = "vertical", invalid = false, fieldId, ...props },
    ref,
  ) => {
    const autoId = React.useId();
    const id = fieldId ?? `field-${autoId}`;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    const value = React.useMemo<FieldContextValue>(
      () => ({
        id,
        descriptionId,
        errorId,
        hasError: invalid,
        orientation,
      }),
      [id, descriptionId, errorId, invalid, orientation],
    );

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="field"
          data-orientation={orientation}
          data-invalid={invalid || undefined}
          className={cn(
            "grid gap-1.5",
            orientation === "horizontal" && "grid-cols-[auto_1fr] items-center gap-3",
            className,
          )}
          {...props}
        />
      </FieldContext.Provider>
    );
  },
);
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { id } = useFieldContext();

  return (
    <Label
      ref={ref}
      htmlFor={id}
      data-slot="field-label"
      className={cn("text-sm font-medium text-form-label", className)}
      {...props}
    />
  );
});
FieldLabel.displayName = "FieldLabel";

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { descriptionId } = useFieldContext();

  return (
    <p
      ref={ref}
      id={descriptionId}
      data-slot="field-description"
      className={cn("text-xs text-form-description", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { message?: string | null }
>(({ className, children, message, ...props }, ref) => {
  const { errorId, hasError } = useFieldContext();

  if (!hasError && !message && !children) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={errorId}
      role="alert"
      data-slot="field-error"
      className={cn("text-xs font-medium text-form-error", className)}
      {...props}
    >
      {children ?? message}
    </p>
  );
});
FieldError.displayName = "FieldError";

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field-group"
    className={cn("flex flex-col gap-4", className)}
    {...props}
  />
));
FieldGroup.displayName = "FieldGroup";

const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    data-slot="field-set"
    className={cn("flex flex-col gap-3 border-0 p-0", className)}
    {...props}
  />
));
FieldSet.displayName = "FieldSet";

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
  <legend
    ref={ref}
    data-slot="field-legend"
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
FieldLegend.displayName = "FieldLegend";

const FieldSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    data-slot="field-separator"
    className={cn("h-px w-full bg-border", className)}
    {...props}
  />
));
FieldSeparator.displayName = "FieldSeparator";

export {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  useFieldContext,
};
