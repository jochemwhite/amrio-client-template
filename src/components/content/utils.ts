import type {
  BaseContentField,
  DateFieldContent,
  RenderableContentField,
  RichTextFieldContent,
} from "@/types/content";

export function sortByOrder<T extends { order?: number | null }>(items: T[]) {
  return [...items].sort((left, right) => {
    if (left.order == null && right.order == null) {
      return 0;
    }

    if (left.order == null) {
      return 1;
    }

    if (right.order == null) {
      return -1;
    }

    return left.order - right.order;
  });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getFieldLabel(field: BaseContentField) {
  return field.label ?? field.fieldKey ?? field.type;
}

export function getFieldByKey<TField extends { fieldKey?: string | null }>(
  fields: TField[],
  fieldKey: string,
): TField | undefined;
export function getFieldByKey<
  TField extends { fieldKey?: string | null; type: string },
  TType extends TField["type"],
>(
  fields: TField[],
  fieldKey: string,
  type: TType,
): Extract<TField, { type: TType }> | undefined;
export function getFieldByKey<
  TField extends { fieldKey?: string | null; type?: string },
>(fields: TField[], fieldKey: string, type?: string) {
  return fields.find(
    (field) =>
      field.fieldKey === fieldKey && (type == null || field.type === type),
  );
}

export function formatUnknownContent(content: unknown) {
  if (content == null) {
    return "No content";
  }

  if (typeof content === "string") {
    return content;
  }

  return JSON.stringify(content, null, 2);
}

export function getTextAlignClass(align?: string) {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

export function getStringValue(content: unknown, key: string) {
  if (!isRecord(content)) {
    return undefined;
  }

  const value = content[key];
  return typeof value === "string" ? value : undefined;
}

export function getArrayValue<T>(
  content: unknown,
  key: string,
  guard: (value: unknown) => value is T,
) {
  if (!isRecord(content)) {
    return undefined;
  }

  const value = content[key];
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.filter(guard);
}

export function formatDateContent(content: DateFieldContent | unknown) {
  if (!isRecord(content)) {
    return null;
  }

  const value = typeof content.value === "string" ? content.value : undefined;

  if (!value) {
    return typeof content.emptyLabel === "string" ? content.emptyLabel : null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    typeof content.locale === "string" ? content.locale : undefined,
    isRecord(content.format)
      ? (content.format as Intl.DateTimeFormatOptions)
      : {
          dateStyle: "medium",
        },
  ).format(date);
}

export function getRichTextPlainText(content: RichTextFieldContent | unknown) {
  if (!isRecord(content)) {
    return "";
  }

  if (typeof content.plainText === "string") {
    return content.plainText;
  }

  if (Array.isArray(content.blocks)) {
    return content.blocks
      .flatMap((block) => {
        if (!isRecord(block)) {
          return [];
        }

        if (Array.isArray(block.spans)) {
          return block.spans
            .filter(isRecord)
            .map((span) => (typeof span.text === "string" ? span.text : ""))
            .filter(Boolean);
        }

        if (Array.isArray(block.items)) {
          return block.items.flatMap((item) =>
            Array.isArray(item)
              ? item
                  .filter(isRecord)
                  .map((span) =>
                    typeof span.text === "string" ? span.text : "",
                  )
                  .filter(Boolean)
              : [],
          );
        }

        return [];
      })
      .join(" ");
  }

  if (typeof content.html === "string") {
    return content.html;
  }

  return "";
}

export function isRenderableField(
  value: unknown,
): value is RenderableContentField {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.type === "string" &&
    "content" in value
  );
}
