import type { ReactElement } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import type {
  BuilderField,
  LayoutBuilderField,
  SubmissionBuilderField,
} from "@/types/form-builder";

/** Render context passed to every submission-field renderer. */
export type SubmissionFieldRenderContext<
  F extends SubmissionBuilderField = SubmissionBuilderField,
> = {
  block: F;
  rhf: UseFormReturn<FieldValues>;
  fieldId: string;
};

/**
 * Submission-field renderers return just the inner control. The surrounding
 * `<Field>` wrapper (label, description, error) is provided by FormRenderer.
 */
export type SubmissionFieldRenderer<
  F extends SubmissionBuilderField = SubmissionBuilderField,
> = (ctx: SubmissionFieldRenderContext<F>) => ReactElement;

/** Render context passed to every layout-block renderer. */
export type LayoutBlockRenderContext<
  F extends LayoutBuilderField = LayoutBuilderField,
> = {
  block: F;
  rhf: UseFormReturn<FieldValues>;
  values: Record<string, unknown>;
  renderChild: (child: BuilderField) => ReactElement | null;
};

/**
 * Layout blocks render their full markup (headings, sections, etc.) and
 * control their own layout, so their renderers return complete JSX.
 */
export type LayoutBlockRenderer<
  F extends LayoutBuilderField = LayoutBuilderField,
> = (ctx: LayoutBlockRenderContext<F>) => ReactElement | null;
