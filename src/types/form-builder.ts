export const SUBMISSION_FIELD_TYPES = [
  "text",
  "email",
  "textarea",
  "number",
  "checkbox",
  "select",
  "date",
  "radio",
  "multiselect",
  "toggle",
  "file",
  "phone",
  "password",
  "url",
  "time",
  "dateRange",
  "range",
  "rating",
] as const;

export const LAYOUT_FIELD_TYPES = [
  "heading",
  "paragraph",
  "divider",
  "section",
] as const;

export const BUILDER_FIELD_TYPES = [
  ...SUBMISSION_FIELD_TYPES,
  ...LAYOUT_FIELD_TYPES,
] as const;

export type SubmissionFieldType = (typeof SUBMISSION_FIELD_TYPES)[number];
export type LayoutFieldType = (typeof LAYOUT_FIELD_TYPES)[number];
export type BuilderFieldType = (typeof BUILDER_FIELD_TYPES)[number];

export type FieldWidth = "full" | "half" | "third";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type ConditionalOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "isEmpty"
  | "isNotEmpty"
  | "greaterThan"
  | "lessThan";

export type ConditionalRule = {
  field: string;
  operator: ConditionalOperator;
  value?: string | number | boolean | null;
};

export type ConditionalLogic = {
  action?: "show" | "hide";
  match?: "all" | "any";
  rules: ConditionalRule[];
};

export type BuilderFieldDefaultValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | {
      from?: string | null;
      to?: string | null;
    };

type BuilderFieldCommon = {
  id: string;
  key?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: BuilderFieldDefaultValue;
  readOnly?: boolean;
  hidden?: boolean;
  width?: FieldWidth;
  conditionalLogic?: ConditionalLogic;
};

type WithKey<T extends { key?: string }> = T extends unknown
  ? Omit<T, "key"> & { key: string }
  : never;

export type TextBuilderField = BuilderFieldCommon & {
  type: "text";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string;
};

export type EmailBuilderField = BuilderFieldCommon & {
  type: "email";
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
};

export type TextareaBuilderField = BuilderFieldCommon & {
  type: "textarea";
  minLength?: number;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
};

export type NumberBuilderField = BuilderFieldCommon & {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
};

export type CheckboxBuilderField = BuilderFieldCommon & {
  type: "checkbox";
  defaultValue?: boolean;
};

export type SelectBuilderField = BuilderFieldCommon & {
  type: "select";
  options?: SelectOption[];
  defaultValue?: string;
};

export type DateBuilderField = BuilderFieldCommon & {
  type: "date";
  minDate?: string;
  maxDate?: string;
  defaultValue?: string;
};

export type RadioBuilderField = BuilderFieldCommon & {
  type: "radio";
  options?: SelectOption[];
  defaultValue?: string;
};

export type MultiSelectBuilderField = BuilderFieldCommon & {
  type: "multiselect";
  options?: SelectOption[];
  minSelections?: number;
  maxSelections?: number;
  defaultValue?: string[];
};

export type ToggleBuilderField = BuilderFieldCommon & {
  type: "toggle";
  defaultValue?: boolean;
};

export type FileBuilderField = BuilderFieldCommon & {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
};

export type PhoneBuilderField = BuilderFieldCommon & {
  type: "phone";
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
};

export type PasswordBuilderField = BuilderFieldCommon & {
  type: "password";
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
};

export type UrlBuilderField = BuilderFieldCommon & {
  type: "url";
  defaultValue?: string;
};

export type TimeBuilderField = BuilderFieldCommon & {
  type: "time";
  minTime?: string;
  maxTime?: string;
  defaultValue?: string;
};

export type DateRangeBuilderField = BuilderFieldCommon & {
  type: "dateRange";
  minDate?: string;
  maxDate?: string;
  defaultValue?: { from?: string | null; to?: string | null };
};

export type RangeBuilderField = BuilderFieldCommon & {
  type: "range";
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
};

export type RatingBuilderField = BuilderFieldCommon & {
  type: "rating";
  max?: number;
  defaultValue?: number;
};

export type SubmissionBuilderField = WithKey<
  | TextBuilderField
  | EmailBuilderField
  | TextareaBuilderField
  | NumberBuilderField
  | CheckboxBuilderField
  | SelectBuilderField
  | DateBuilderField
  | RadioBuilderField
  | MultiSelectBuilderField
  | ToggleBuilderField
  | FileBuilderField
  | PhoneBuilderField
  | PasswordBuilderField
  | UrlBuilderField
  | TimeBuilderField
  | DateRangeBuilderField
  | RangeBuilderField
  | RatingBuilderField
>;

export type HeadingBuilderField = Omit<BuilderFieldCommon, "key"> & {
  type: "heading";
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type ParagraphBuilderField = Omit<BuilderFieldCommon, "key"> & {
  type: "paragraph";
  text?: string;
};

export type DividerBuilderField = Omit<BuilderFieldCommon, "key"> & {
  type: "divider";
};

export type SectionBuilderField = Omit<BuilderFieldCommon, "key"> & {
  type: "section";
  title?: string;
  description?: string;
  children?: BuilderField[];
};

export type LayoutBuilderField =
  | HeadingBuilderField
  | ParagraphBuilderField
  | DividerBuilderField
  | SectionBuilderField;

export type BuilderField = SubmissionBuilderField | LayoutBuilderField;

export type CmsForm = {
  id: string;
  name: string;
  description: string | null;
  published: boolean;
  share_url: string;
  content: BuilderField[];
};

export type FormSubmissionValues = Record<string, unknown>;

export type FormSubmissionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Record<string, string>;
    };

export function isLayoutField(field: BuilderField): field is LayoutBuilderField {
  return (LAYOUT_FIELD_TYPES as readonly string[]).includes(field.type);
}

export function isSubmissionField(
  field: BuilderField,
): field is SubmissionBuilderField {
  return (SUBMISSION_FIELD_TYPES as readonly string[]).includes(field.type);
}

export function flattenSubmissionFields(
  content: BuilderField[],
): SubmissionBuilderField[] {
  const result: SubmissionBuilderField[] = [];

  for (const field of content) {
    if (isSubmissionField(field)) {
      result.push(field);
      continue;
    }

    if (field.type === "section" && Array.isArray(field.children)) {
      result.push(...flattenSubmissionFields(field.children));
    }
  }

  return result;
}
