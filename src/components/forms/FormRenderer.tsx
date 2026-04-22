"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useWatch,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type {
  BuilderField,
  CmsForm,
  FormSubmissionResult,
  FormSubmissionValues,
  LayoutBuilderField,
  SubmissionBuilderField,
} from "@/types/form-builder";
import {
  computeVisibleSubmissionKeys,
  isFieldVisible,
} from "@/components/forms/conditional-logic";
import {
  layoutBlockRegistry,
  submissionFieldRegistry,
  type LayoutBlockRenderer,
  type SubmissionFieldRenderer,
} from "@/components/forms/fields/registry";
import {
  buildInitialValues,
  createZodSchemaFromFormContent,
} from "@/components/forms/zodFromBuilder";

type SubmitAction = (
  values: FormSubmissionValues,
) => Promise<FormSubmissionResult>;

type FormRendererProps = {
  form: CmsForm;
  onSubmit: SubmitAction;
  className?: string;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  successMessage?: string;
};

const WIDTH_CLASSES: Record<
  NonNullable<SubmissionBuilderField["width"]>,
  string
> = {
  full: "sm:col-span-6",
  half: "sm:col-span-3",
  third: "sm:col-span-2",
};

function widthClass(field: BuilderField): string {
  const width =
    "width" in field && field.width ? field.width : ("full" as const);
  return WIDTH_CLASSES[width] ?? WIDTH_CLASSES.full;
}

function isLayoutBlock(block: BuilderField): block is LayoutBuilderField {
  return (
    block.type === "heading" ||
    block.type === "paragraph" ||
    block.type === "divider" ||
    block.type === "section"
  );
}

function flattenErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const candidate = error as { message?: unknown };
  if (typeof candidate.message === "string" && candidate.message.trim()) {
    return candidate.message;
  }

  for (const value of Object.values(error as Record<string, unknown>)) {
    const nested = flattenErrorMessage(value);
    if (nested) return nested;
  }

  return null;
}

export function FormRenderer({
  form,
  onSubmit,
  className,
  submitLabel = "Submit",
  resetOnSuccess = false,
  successMessage = "Thanks — your submission has been received.",
}: FormRendererProps) {
  const content = form.content;

  const defaultValues = React.useMemo(
    () => buildInitialValues(content),
    [content],
  );

  const resolver = React.useMemo<Resolver<FieldValues>>(() => {
    return async (values, context, options) => {
      const visibleKeys = computeVisibleSubmissionKeys(
        content,
        values as Record<string, unknown>,
      );
      const schema = createZodSchemaFromFormContent(content, { visibleKeys });
      return zodResolver(schema)(values, context, options);
    };
  }, [content]);

  const rhf = useForm<FieldValues>({
    defaultValues,
    resolver,
    mode: "onTouched",
  });

  const watchedValues = useWatch({ control: rhf.control }) as Record<
    string,
    unknown
  >;
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = rhf.handleSubmit(async (values) => {
    setFormError(null);

    // Strip values of keys that are not currently visible so the server
    // does not persist stale data from hidden/conditional branches.
    const visibleKeys = computeVisibleSubmissionKeys(
      content,
      values as Record<string, unknown>,
    );
    const payload: FormSubmissionValues = {};
    for (const key of visibleKeys) {
      payload[key] = (values as Record<string, unknown>)[key];
    }

    const result = await onSubmit(payload);

    if (result.success) {
      setSubmitted(true);
      if (resetOnSuccess) {
        rhf.reset(defaultValues);
      }
      return;
    }

    if (result.fieldErrors) {
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        rhf.setError(key, { type: "server", message });
      }
    }

    if (result.formError) {
      setFormError(result.formError);
    }
  });

  if (submitted && !resetOnSuccess) {
    return (
      <div
        className={cn(
          "rounded-md border border-form-control-border bg-form-control-muted p-6 text-sm text-form-label",
          className,
        )}
        role="status"
      >
        <p className="font-medium">{successMessage}</p>
        {form.description ? (
          <p className="mt-1 text-form-description">{form.description}</p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      noValidate
      aria-describedby={form.description ? `${form.id}-description` : undefined}
    >
      {(form.name || form.description) && (
        <header className="flex flex-col gap-1">
          {form.name ? (
            <h2 className="text-xl font-semibold text-form-label">
              {form.name}
            </h2>
          ) : null}
          {form.description ? (
            <p
              id={`${form.id}-description`}
              className="text-sm text-form-description"
            >
              {form.description}
            </p>
          ) : null}
        </header>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        {content.map((block) => (
          <FormBlock
            key={block.id}
            block={block}
            rhf={rhf}
            values={watchedValues}
          />
        ))}
      </div>

      {submitted && resetOnSuccess ? (
        <p className="text-sm text-form-success" role="status">
          {successMessage}
        </p>
      ) : null}

      {formError ? (
        <p className="text-sm text-form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div>
        <Button
          type="submit"
          disabled={rhf.formState.isSubmitting}
          aria-busy={rhf.formState.isSubmitting || undefined}
        >
          {rhf.formState.isSubmitting ? "Submitting…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

type FormBlockProps = {
  block: BuilderField;
  rhf: UseFormReturn<FieldValues>;
  values: Record<string, unknown>;
};

function FormBlock({ block, rhf, values }: FormBlockProps) {
  if (!isFieldVisible(block, values)) {
    return null;
  }

  if (isLayoutBlock(block)) {
    const renderer = layoutBlockRegistry[
      block.type
    ] as LayoutBlockRenderer<LayoutBuilderField>;
    return renderer({
      block,
      rhf,
      values,
      renderChild: (child) => (
        <FormBlock key={child.id} block={child} rhf={rhf} values={values} />
      ),
    });
  }

  return <SubmissionBlock block={block} rhf={rhf} />;
}

function SubmissionBlock({
  block,
  rhf,
}: {
  block: SubmissionBuilderField;
  rhf: UseFormReturn<FieldValues>;
}) {
  const key = block.key;
  const errorMessage = flattenErrorMessage(rhf.formState.errors[key]);
  const hasError = Boolean(errorMessage);
  const fieldId = `field-${key}`;

  const renderer = submissionFieldRegistry[
    block.type
  ] as SubmissionFieldRenderer<SubmissionBuilderField>;

  return (
    <Field className={widthClass(block)} invalid={hasError} fieldId={fieldId}>
      {block.label ? (
        <FieldLabel>
          {block.label}
          {block.required ? (
            <span className="ml-0.5 text-form-error" aria-hidden="true">
              *
            </span>
          ) : null}
        </FieldLabel>
      ) : null}

      {renderer({ block, rhf, fieldId })}

      {block.helpText ? (
        <FieldDescription>{block.helpText}</FieldDescription>
      ) : null}

      <FieldError message={errorMessage ?? undefined} />
    </Field>
  );
}

export { buildInitialValues, createZodSchemaFromFormContent };
export type { FormRendererProps };
