import { z, type ZodType, type ZodObject } from "zod";

import type {
  BuilderField,
  DateRangeBuilderField,
  FileBuilderField,
  MultiSelectBuilderField,
  NumberBuilderField,
  RangeBuilderField,
  RatingBuilderField,
  SubmissionBuilderField,
} from "@/types/form-builder";
import { flattenSubmissionFields } from "@/types/form-builder";

export type ZodBuilderOptions = {
  /**
   * When provided, fields whose key is NOT in this set are treated as
   * not visible: their schema is relaxed to optional/nullable so validation
   * only enforces required on visible fields.
   */
  visibleKeys?: Set<string> | null;
};

type BuilderToZod<F extends SubmissionBuilderField> = (field: F) => ZodType;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const PHONE_PATTERN = /^[+()\d\s\-.]{5,}$/;
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

type StringConstraints = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

function buildStringSchema(
  source: StringConstraints,
  opts: {
    baseMessage?: string;
    kind?: "email" | "url" | "phone" | "password" | "text" | "time";
  } = {},
): ZodType {
  const field: StringConstraints = source;
  let schema = z.string();

  if (opts.kind === "email") {
    schema = schema.regex(EMAIL_PATTERN, {
      message: "Please enter a valid email address.",
    });
  }

  if (opts.kind === "url") {
    schema = schema.regex(URL_PATTERN, {
      message: "Please enter a valid URL.",
    });
  }

  if (opts.kind === "phone") {
    schema = schema.regex(PHONE_PATTERN, {
      message: "Please enter a valid phone number.",
    });
  }

  if (opts.kind === "time") {
    schema = schema.regex(TIME_PATTERN, {
      message: "Please enter a valid time (HH:MM).",
    });
  }

  if (typeof field.minLength === "number") {
    schema = schema.min(field.minLength, {
      message: `Must be at least ${field.minLength} characters.`,
    });
  }

  if (typeof field.maxLength === "number") {
    schema = schema.max(field.maxLength, {
      message: `Must be at most ${field.maxLength} characters.`,
    });
  }

  if (typeof field.pattern === "string" && field.pattern) {
    try {
      const re = new RegExp(field.pattern);
      schema = schema.regex(re, {
        message: opts.baseMessage ?? "Value does not match the required format.",
      });
    } catch {
      // Invalid regex coming from CMS content — skip it rather than crash.
    }
  }

  return schema;
}

function buildNumberSchema(field: NumberBuilderField | RangeBuilderField | RatingBuilderField): ZodType {
  let schema = z.coerce.number({
    message: "Please enter a valid number.",
  });

  if ("min" in field && typeof field.min === "number") {
    schema = schema.min(field.min, {
      message: `Must be at least ${field.min}.`,
    });
  }

  if ("max" in field && typeof field.max === "number") {
    schema = schema.max(field.max, {
      message: `Must be at most ${field.max}.`,
    });
  }

  if (field.type === "rating") {
    const rating = field as RatingBuilderField;
    const max = rating.max ?? 5;
    schema = schema.min(0).max(max, {
      message: `Rating must be between 0 and ${max}.`,
    });
  }

  return schema;
}

function buildDateSchema(field: {
  minDate?: string;
  maxDate?: string;
}): ZodType {
  let schema: z.ZodType<string> = z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Please enter a valid date.",
    });

  if (field.minDate) {
    const minTime = Date.parse(field.minDate);
    if (!Number.isNaN(minTime)) {
      schema = schema.refine(
        (value) => {
          const t = Date.parse(value);
          return !Number.isNaN(t) && t >= minTime;
        },
        { message: `Date must be on or after ${field.minDate}.` },
      );
    }
  }

  if (field.maxDate) {
    const maxTime = Date.parse(field.maxDate);
    if (!Number.isNaN(maxTime)) {
      schema = schema.refine(
        (value) => {
          const t = Date.parse(value);
          return !Number.isNaN(t) && t <= maxTime;
        },
        { message: `Date must be on or before ${field.maxDate}.` },
      );
    }
  }

  return schema;
}

function buildDateRangeSchema(field: DateRangeBuilderField): ZodType {
  const minTime = field.minDate ? Date.parse(field.minDate) : NaN;
  const maxTime = field.maxDate ? Date.parse(field.maxDate) : NaN;

  const dateInput = (label: string) =>
    z
      .string()
      .refine(
        (value) => value === "" || !Number.isNaN(Date.parse(value)),
        { message: `Please enter a valid ${label} date.` },
      )
      .refine(
        (value) => {
          if (!value || Number.isNaN(minTime)) return true;
          return Date.parse(value) >= minTime;
        },
        { message: `Date must be on or after ${field.minDate}.` },
      )
      .refine(
        (value) => {
          if (!value || Number.isNaN(maxTime)) return true;
          return Date.parse(value) <= maxTime;
        },
        { message: `Date must be on or before ${field.maxDate}.` },
      )
      .optional()
      .nullable();

  return z
    .object({
      from: dateInput("start"),
      to: dateInput("end"),
    })
    .refine(
      (value) => {
        if (!value.from || !value.to) return true;
        const from = Date.parse(value.from);
        const to = Date.parse(value.to);
        if (Number.isNaN(from) || Number.isNaN(to)) return true;
        return from <= to;
      },
      { message: "Start date must be before end date.", path: ["to"] },
    );
}

function buildMultiSelectSchema(field: MultiSelectBuilderField): ZodType {
  let schema = z.array(z.string());

  if (typeof field.minSelections === "number") {
    schema = schema.min(field.minSelections, {
      message: `Select at least ${field.minSelections} option${field.minSelections === 1 ? "" : "s"}.`,
    });
  }

  if (typeof field.maxSelections === "number") {
    schema = schema.max(field.maxSelections, {
      message: `Select at most ${field.maxSelections} option${field.maxSelections === 1 ? "" : "s"}.`,
    });
  }

  return schema;
}

function buildFileSchema(field: FileBuilderField): ZodType {
  const item = z.any();
  let schema: z.ZodType = z.array(item);

  if (field.multiple === false) {
    schema = z.union([item, schema]);
  }

  if (typeof field.maxFiles === "number") {
    schema = z.array(item).max(field.maxFiles, {
      message: `Upload at most ${field.maxFiles} file${field.maxFiles === 1 ? "" : "s"}.`,
    });
  }

  return schema;
}

/**
 * Map from submission field type -> zod schema factory.
 * Adding a new submission type = add a line here (and a renderer entry).
 */
const SUBMISSION_ZOD_BUILDERS: {
  [K in SubmissionBuilderField["type"]]: BuilderToZod<
    Extract<SubmissionBuilderField, { type: K }>
  >;
} = {
  text: (field) => buildStringSchema(field),
  email: (field) => buildStringSchema(field, { kind: "email" }),
  textarea: (field) => buildStringSchema(field),
  number: (field) => buildNumberSchema(field),
  checkbox: () => z.coerce.boolean(),
  select: (field) => {
    const options = field.options ?? [];
    if (options.length > 0) {
      const values = options.map((option) => option.value);
      return z.string().refine((value) => values.includes(value), {
        message: "Please select a valid option.",
      });
    }
    return z.string();
  },
  date: (field) => buildDateSchema(field),
  radio: (field) => {
    const options = field.options ?? [];
    if (options.length > 0) {
      const values = options.map((option) => option.value);
      return z.string().refine((value) => values.includes(value), {
        message: "Please select a valid option.",
      });
    }
    return z.string();
  },
  multiselect: (field) => buildMultiSelectSchema(field),
  toggle: () => z.coerce.boolean(),
  file: (field) => buildFileSchema(field),
  phone: (field) => buildStringSchema(field, { kind: "phone" }),
  password: (field) => buildStringSchema(field, { kind: "password" }),
  url: () => buildStringSchema({}, { kind: "url" }),
  time: () => buildStringSchema({}, { kind: "time" }),
  dateRange: (field) => buildDateRangeSchema(field),
  range: (field) => buildNumberSchema(field),
  rating: (field) => buildNumberSchema(field),
};

function buildSchemaForField(field: SubmissionBuilderField): ZodType {
  const builder = SUBMISSION_ZOD_BUILDERS[field.type] as BuilderToZod<
    SubmissionBuilderField
  >;
  return builder(field);
}

function applyRequired(
  schema: ZodType,
  field: SubmissionBuilderField,
): ZodType {
  const required = field.required === true;

  if (!required) {
    return schema.optional().nullable();
  }

  switch (field.type) {
    case "checkbox":
    case "toggle":
      return z.coerce
        .boolean()
        .refine((value) => value === true, {
          message: "This must be checked.",
        });
    case "multiselect":
      return (schema as z.ZodArray<ZodType>).nonempty({
        message: "Please select at least one option.",
      });
    case "dateRange":
      return schema.refine(
        (value) =>
          !!value &&
          typeof value === "object" &&
          !!(value as { from?: unknown }).from &&
          !!(value as { to?: unknown }).to,
        { message: "Please select a start and end date." },
      );
    default:
      return schema as ZodType;
  }
}

/**
 * Build a Zod object schema from the form builder content.
 *
 * Only submission blocks contribute keys. Layout blocks (heading/paragraph/
 * divider/section containers) are skipped, but submission fields nested
 * inside sections are included.
 *
 * When `visibleKeys` is provided, fields whose key is NOT in the set are
 * treated as not visible and their schema becomes optional/nullable, so
 * validation only enforces required/constraints on currently visible fields.
 */
export function createZodSchemaFromFormContent(
  content: BuilderField[],
  options: ZodBuilderOptions = {},
): ZodObject<Record<string, ZodType>> {
  const shape: Record<string, ZodType> = {};
  const fields = flattenSubmissionFields(content);
  const visibleKeys = options.visibleKeys;

  for (const field of fields) {
    const isVisible = visibleKeys ? visibleKeys.has(field.key) : true;
    const baseSchema = buildSchemaForField(field);
    const withRequired = isVisible
      ? applyRequired(baseSchema, field)
      : baseSchema.optional().nullable();

    shape[field.key] = withRequired;
  }

  return z.object(shape);
}

/**
 * Infer a sensible default value for a submission field, matching what the
 * generated Zod schema expects so react-hook-form stays controlled.
 */
export function getFieldDefaultValue(field: SubmissionBuilderField): unknown {
  if (field.defaultValue !== undefined && field.defaultValue !== null) {
    return field.defaultValue;
  }

  switch (field.type) {
    case "checkbox":
    case "toggle":
      return false;
    case "multiselect":
      return [] as string[];
    case "number":
    case "range":
    case "rating":
      return "";
    case "dateRange":
      return { from: "", to: "" };
    case "file":
      return null;
    default:
      return "";
  }
}

export function buildInitialValues(
  content: BuilderField[],
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of flattenSubmissionFields(content)) {
    values[field.key] = getFieldDefaultValue(field);
  }
  return values;
}
