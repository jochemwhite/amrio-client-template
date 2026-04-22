import type {
  LayoutBuilderField,
  SubmissionBuilderField,
} from "@/types/form-builder";

import { renderCheckboxField } from "./checkbox";
import { renderDateField } from "./date";
import { renderDateRangeField } from "./date-range";
import { renderDividerBlock } from "./divider";
import { renderEmailField } from "./email";
import { renderFileField } from "./file";
import { renderHeadingBlock } from "./heading";
import { renderMultiSelectField } from "./multiselect";
import { renderNumberField } from "./number";
import { renderParagraphBlock } from "./paragraph";
import { renderPasswordField } from "./password";
import { renderPhoneField } from "./phone";
import { renderRadioField } from "./radio";
import { renderRangeField } from "./range";
import { renderRatingField } from "./rating";
import { renderSectionBlock } from "./section";
import { renderSelectField } from "./select";
import { renderTextareaField } from "./textarea";
import { renderTextField } from "./text";
import { renderTimeField } from "./time";
import { renderToggleField } from "./toggle";
import { renderUrlField } from "./url";
import type {
  LayoutBlockRenderer,
  SubmissionFieldRenderer,
} from "./types";

/**
 * Registry of submission-field renderers. Keys are the discriminant of
 * `SubmissionBuilderField`, so adding a new submission type is a compile-time
 * error until this map — and the matching Zod builder in `zodFromBuilder.ts`
 * — are updated.
 */
export const submissionFieldRegistry: {
  [K in SubmissionBuilderField["type"]]: SubmissionFieldRenderer<
    Extract<SubmissionBuilderField, { type: K }>
  >;
} = {
  text: renderTextField,
  email: renderEmailField,
  textarea: renderTextareaField,
  number: renderNumberField,
  checkbox: renderCheckboxField,
  select: renderSelectField,
  date: renderDateField,
  radio: renderRadioField,
  multiselect: renderMultiSelectField,
  toggle: renderToggleField,
  file: renderFileField,
  phone: renderPhoneField,
  password: renderPasswordField,
  url: renderUrlField,
  time: renderTimeField,
  dateRange: renderDateRangeField,
  range: renderRangeField,
  rating: renderRatingField,
};

/**
 * Registry of layout-block renderers. Layout blocks (heading, paragraph,
 * divider, section) never have a `key` and are not part of the submission
 * schema — they only shape the visual layout of the form.
 */
export const layoutBlockRegistry: {
  [K in LayoutBuilderField["type"]]: LayoutBlockRenderer<
    Extract<LayoutBuilderField, { type: K }>
  >;
} = {
  heading: renderHeadingBlock,
  paragraph: renderParagraphBlock,
  divider: renderDividerBlock,
  section: renderSectionBlock,
};

export type SubmissionFieldRegistry = typeof submissionFieldRegistry;
export type LayoutBlockRegistry = typeof layoutBlockRegistry;

export type { SubmissionFieldRenderer, LayoutBlockRenderer } from "./types";
