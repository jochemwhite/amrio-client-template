import type { CmsContentField } from "@/types/cms";
import type {
  BooleanContentField,
  ButtonContentField,
  DateContentField,
  FormContentField,
  ImageContentField,
  NavigationMenuContentField,
  NavigationMenuItem,
  ReferenceContentField,
  RenderableContentField,
  RichTextBlock,
  RichTextContentField,
  RichTextMark,
  RichTextSpan,
  SectionContentField,
  SocialMediaContentField,
  TextContentField,
  VideoContentField,
} from "@/types/content";
import type { BuilderField } from "@/types/form-builder";
import { isRecord, isRenderableField } from "@/components/content/utils";

function getString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function getBoolean(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") {
      return value;
    }
  }

  return undefined;
}

function getNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") {
      return value;
    }
  }

  return undefined;
}

function asRecordArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord);
}

function getNestedRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return isRecord(value) ? value : undefined;
}

function getRichTextMarks(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const marks = value.filter(isRecord).reduce<RichTextMark>((acc, mark) => {
        switch (getString(mark, ["type"])) {
          case "bold":
          case "strong":
            acc.bold = true;
            break;
          case "italic":
          case "em":
            acc.italic = true;
            break;
          case "underline":
            acc.underline = true;
            break;
          case "code":
            acc.code = true;
            break;
          default:
            break;
        }

        return acc;
      },
      {},
    );

  return Object.keys(marks).length > 0 ? marks : undefined;
}

function flattenRichTextSpans(value: unknown): RichTextSpan[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .flatMap<RichTextSpan>((node) => {
      const type = getString(node, ["type"]);

      if (type === "text") {
        const text = getString(node, ["text"]);

        if (!text) {
          return [];
        }

        return [
          {
            text,
            marks: getRichTextMarks(node.marks),
          },
        ];
      }

      if (type === "hardBreak") {
        return [{ text: "\n" }];
      }

      return flattenRichTextSpans(node.content);
    });
}

function normalizeDocBlock(
  node: Record<string, unknown>,
): RichTextBlock | null {
  const type = getString(node, ["type"]);
  const attrs = getNestedRecord(node, "attrs");

  switch (type) {
    case "heading":
      return {
        type: "heading",
        level:
          ((attrs ? getNumber(attrs, ["level"]) : undefined) as
            | 1
            | 2
            | 3
            | 4
            | 5
            | 6
            | undefined) ?? 2,
        spans: flattenRichTextSpans(node.content),
      };
    case "blockquote":
      return {
        type: "blockquote",
        spans: flattenRichTextSpans(node.content),
      };
    case "bulletList":
    case "orderedList":
      return {
        type: "list",
        ordered: type === "orderedList",
        items: asRecordArray(node.content).map((item) =>
          flattenRichTextSpans(item.content),
        ),
      };
    case "paragraph":
      return {
        type: "paragraph",
        spans: flattenRichTextSpans(node.content),
      };
    default:
      return null;
  }
}

function parseRichTextDoc(raw: Record<string, unknown>) {
  if (getString(raw, ["type"]) !== "doc") {
    return undefined;
  }

  const blocks = asRecordArray(raw.content)
    .map(normalizeDocBlock)
    .filter((block): block is NonNullable<typeof block> => block !== null);

  if (blocks.length === 0) {
    return undefined;
  }

  return { blocks };
}

function inferTextVariant(fieldKey?: string | null): TextContentField["content"]["variant"] {
  if (!fieldKey) {
    return "body";
  }

  if (/title|headline|heading/i.test(fieldKey)) {
    return "heading";
  }

  if (/subtitle|sub_title|subheading/i.test(fieldKey)) {
    return "subheading";
  }

  return "body";
}

function parseTextContent(field: CmsContentField): TextContentField {
  const raw = field.content;

  if (typeof raw === "string") {
    return {
      id: field.id,
      type: "text",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        text: raw,
        variant: inferTextVariant(field.field_key),
      },
    };
  }

  if (isRecord(raw)) {
    const text = getString(raw, [
      "text",
      "value",
      "content",
      "label",
      "title",
      "name",
    ]);

    return {
      id: field.id,
      type: "text",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        text,
        variant: inferTextVariant(field.field_key),
        align: getString(raw, ["align", "alignment"]) as
          | "left"
          | "center"
          | "right"
          | undefined,
      },
    };
  }

  return {
    id: field.id,
    type: "text",
    fieldKey: field.field_key,
    order: field.order,
    content: {
      text: undefined,
      variant: inferTextVariant(field.field_key),
    },
  };
}

function parseRichTextContent(field: CmsContentField): RichTextContentField {
  const raw = field.content;

  if (typeof raw === "string") {
    const looksLikeHtml = /<[^>]+>/.test(raw);

    return {
      id: field.id,
      type: "richtext",
      fieldKey: field.field_key,
      order: field.order,
      content: looksLikeHtml
        ? { html: raw, plainText: raw.replace(/<[^>]+>/g, " ").trim() }
        : { plainText: raw },
    };
  }

  if (Array.isArray(raw)) {
    return {
      id: field.id,
      type: "richtext",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        blocks: raw as RichTextContentField["content"]["blocks"],
      },
    };
  }

  if (isRecord(raw)) {
    const docContent = parseRichTextDoc(raw);

    if (docContent) {
      return {
        id: field.id,
        type: "richtext",
        fieldKey: field.field_key,
        order: field.order,
        content: docContent,
      };
    }

    return {
      id: field.id,
      type: "richtext",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        plainText: getString(raw, ["plainText", "text", "value", "content"]),
        html: getString(raw, ["html"]),
        blocks: Array.isArray(raw.blocks)
          ? (raw.blocks as RichTextContentField["content"]["blocks"])
          : undefined,
      },
    };
  }

  return {
    id: field.id,
    type: "richtext",
    fieldKey: field.field_key,
    order: field.order,
    content: {},
  };
}

function parseBooleanContent(field: CmsContentField): BooleanContentField {
  const raw = field.content;

  if (typeof raw === "boolean") {
    return {
      id: field.id,
      type: "boolean",
      fieldKey: field.field_key,
      order: field.order,
      content: { value: raw },
    };
  }

  if (isRecord(raw)) {
    return {
      id: field.id,
      type: "boolean",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        value: getBoolean(raw, ["value", "enabled", "checked", "active"]),
        trueLabel: getString(raw, ["trueLabel", "true_label", "onLabel"]),
        falseLabel: getString(raw, ["falseLabel", "false_label", "offLabel"]),
      },
    };
  }

  return {
    id: field.id,
    type: "boolean",
    fieldKey: field.field_key,
    order: field.order,
    content: {},
  };
}

function parseButtonContent(field: CmsContentField): ButtonContentField {
  const raw = field.content;

  if (typeof raw === "string") {
    return {
      id: field.id,
      type: "button",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        label: raw,
      },
    };
  }

  if (isRecord(raw)) {
    const target =
      getBoolean(raw, ["new_tab", "open_in_new_tab", "external"]) ||
      getString(raw, ["target"]) === "_blank"
        ? "_blank"
        : "_self";

    return {
      id: field.id,
      type: "button",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        label: getString(raw, ["label", "text", "title", "name"]) ?? "Open link",
        href: getString(raw, ["href", "url", "link", "custom_link", "path"]),
        target,
        variant: (getString(raw, ["variant", "style"]) as
          | "primary"
          | "secondary"
          | "ghost"
          | undefined) ?? "primary",
        actionId: getString(raw, ["actionId", "action_id"]),
      },
    };
  }

  return {
    id: field.id,
    type: "button",
    fieldKey: field.field_key,
    order: field.order,
    content: {},
  };
}

function parseDateContent(field: CmsContentField): DateContentField {
  const raw = field.content;

  if (typeof raw === "string" || typeof raw === "number") {
    return {
      id: field.id,
      type: "date",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        value: String(raw),
      },
    };
  }

  if (isRecord(raw)) {
    return {
      id: field.id,
      type: "date",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        value: getString(raw, ["value", "date", "datetime", "start_date"]),
      },
    };
  }

  return {
    id: field.id,
    type: "date",
    fieldKey: field.field_key,
    order: field.order,
    content: {},
  };
}

function extractMediaRecord(raw: unknown) {
  if (!isRecord(raw)) {
    return undefined;
  }

  if (isRecord(raw.asset)) {
    return raw.asset;
  }

  if (isRecord(raw.file)) {
    return raw.file;
  }

  if (isRecord(raw.image)) {
    return raw.image;
  }

  if (isRecord(raw.video)) {
    return raw.video;
  }

  return raw;
}

function parseImageContent(field: CmsContentField): ImageContentField {
  const raw = field.content;

  if (typeof raw === "string") {
    return {
      id: field.id,
      type: "image",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        src: raw,
        alt: field.field_key ?? "",
      },
    };
  }

  const media = extractMediaRecord(raw);

  return {
    id: field.id,
    type: "image",
    fieldKey: field.field_key,
    order: field.order,
    content: {
      src: media ? getString(media, ["src", "url", "path", "file_path"]) : undefined,
      alt: media
        ? getString(media, ["alt", "alt_text", "name", "title"])
        : undefined,
      caption: media
        ? getString(media, ["caption", "description"])
        : undefined,
      width: media ? getNumber(media, ["width"]) : undefined,
      height: media ? getNumber(media, ["height"]) : undefined,
    },
  };
}

function normalizeReferenceItem(value: Record<string, unknown>, index: number) {
  const slug = getString(value, ["slug"]);
  const href =
    getString(value, ["href", "url", "path"]) ??
    (slug ? `/${slug.replace(/^\/+/, "")}` : undefined);

  return {
    id: getString(value, ["id"]) ?? `reference-${index}`,
    title: getString(value, ["title", "name", "label"]),
    description: getString(value, ["description", "excerpt", "summary"]),
    href,
    meta: getString(value, ["meta", "type", "status"]),
    thumbnailSrc: (() => {
      const image = extractMediaRecord(value.image ?? value.thumbnail);
      return image ? getString(image, ["src", "url", "path"]) : undefined;
    })(),
  };
}

function parseReferenceContent(field: CmsContentField): ReferenceContentField {
  const raw = field.content;

  if (Array.isArray(raw)) {
    return {
      id: field.id,
      type: "reference",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        items: asRecordArray(raw).map(normalizeReferenceItem),
      },
    };
  }

  if (isRecord(raw)) {
    if (Array.isArray(raw.items) || Array.isArray(raw.references) || Array.isArray(raw.data)) {
      const items = asRecordArray(raw.items ?? raw.references ?? raw.data).map(
        normalizeReferenceItem,
      );

      return {
        id: field.id,
        type: "reference",
        fieldKey: field.field_key,
        order: field.order,
        content: { items },
      };
    }

    return {
      id: field.id,
      type: "reference",
      fieldKey: field.field_key,
      order: field.order,
      content: normalizeReferenceItem(raw, 0),
    };
  }

  return {
    id: field.id,
    type: "reference",
    fieldKey: field.field_key,
    order: field.order,
    content: {},
  };
}

function parseVideoContent(field: CmsContentField): VideoContentField {
  const raw = field.content;

  if (typeof raw === "string") {
    return {
      id: field.id,
      type: "video",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        src: raw,
      },
    };
  }

  const media = extractMediaRecord(raw);

  return {
    id: field.id,
    type: "video",
    fieldKey: field.field_key,
    order: field.order,
    content: {
      title: media ? getString(media, ["title", "name"]) : undefined,
      caption: media ? getString(media, ["caption", "description"]) : undefined,
      embedUrl: media
        ? getString(media, ["embedUrl", "embed_url", "iframe_url"])
        : undefined,
      src: media ? getString(media, ["src", "url", "path"]) : undefined,
      poster: media ? getString(media, ["poster", "thumbnail"]) : undefined,
    },
  };
}

function normalizeSocialLinks(value: unknown) {
  if (Array.isArray(value)) {
    return asRecordArray(value).map((item, index) => ({
      id: getString(item, ["id"]) ?? `social-${index}`,
      label: getString(item, ["label", "platform", "name"]) ?? `Link ${index + 1}`,
      href: getString(item, ["href", "url", "link"]) ?? "#",
    }));
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .filter(([, href]) => typeof href === "string" && href)
      .map(([label, href], index) => ({
        id: `social-${index}`,
        label,
        href: href as string,
      }));
  }

  return [];
}

function parseSocialMediaContent(field: CmsContentField): SocialMediaContentField {
  const raw = field.content;

  if (isRecord(raw)) {
    return {
      id: field.id,
      type: "social_media",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        title: getString(raw, ["title", "label"]),
        links: normalizeSocialLinks(raw.links ?? raw.platforms ?? raw.items ?? raw),
      },
    };
  }

  return {
    id: field.id,
    type: "social_media",
    fieldKey: field.field_key,
    order: field.order,
    content: {
      links: normalizeSocialLinks(raw),
    },
  };
}

function normalizeNavItem(
  value: Record<string, unknown>,
  index: number,
): NavigationMenuItem {
  return {
    id: getString(value, ["id"]) ?? `nav-${index}`,
    label: getString(value, ["label", "title", "name"]) ?? `Item ${index + 1}`,
    href: getString(value, ["href", "url", "path"]),
    children: Array.isArray(value.children)
      ? asRecordArray(value.children).map(normalizeNavItem)
      : undefined,
  };
}

function parseNavigationMenuContent(
  field: CmsContentField,
): NavigationMenuContentField {
  const raw = field.content;

  if (isRecord(raw)) {
    return {
      id: field.id,
      type: "navigation_menu",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        title: getString(raw, ["title", "label"]),
        orientation: (getString(raw, ["orientation"]) as
          | "horizontal"
          | "vertical"
          | undefined) ?? "vertical",
        items: asRecordArray(raw.items ?? raw.links ?? raw.children).map(
          normalizeNavItem,
        ),
      },
    };
  }

  return {
    id: field.id,
    type: "navigation_menu",
    fieldKey: field.field_key,
    order: field.order,
    content: {
      items: [],
    },
  };
}

function parseSectionContent(field: CmsContentField): SectionContentField {
  const raw = field.content;

  if (isRecord(raw)) {
    const nestedFields = Array.isArray(raw.fields)
      ? raw.fields
          .filter(isRenderableField)
          .map((nestedField) =>
            normalizeCmsContentField({
              id: nestedField.id,
              type: nestedField.type,
              content: nestedField.content,
              order:
                typeof nestedField.order === "number" ? nestedField.order : null,
              field_key:
                typeof nestedField.fieldKey === "string"
                  ? nestedField.fieldKey
                  : null,
            }),
          )
      : Array.isArray(raw.children)
        ? raw.children
            .filter(isRenderableField)
            .map((nestedField) =>
              normalizeCmsContentField({
                id: nestedField.id,
                type: nestedField.type,
                content: nestedField.content,
                order:
                  typeof nestedField.order === "number" ? nestedField.order : null,
                field_key:
                  typeof nestedField.fieldKey === "string"
                    ? nestedField.fieldKey
                    : null,
              }),
            )
        : [];

    return {
      id: field.id,
      type: "section",
      fieldKey: field.field_key,
      order: field.order,
      content: {
        title: getString(raw, ["title", "name", "label"]),
        description: getString(raw, ["description", "subtitle"]),
        layout: (getString(raw, ["layout"]) as "stack" | "grid" | undefined) ?? "stack",
        children: nestedFields,
      },
    };
  }

  return {
    id: field.id,
    type: "section",
    fieldKey: field.field_key,
    order: field.order,
    content: {},
  };
}

function extractFormRecord(raw: unknown): Record<string, unknown> | null {
  if (!isRecord(raw)) return null;

  // The CMS may nest the form under `form`, `data`, or `value`, or deliver it
  // inline. Try the nested candidates first, then fall back to the root.
  for (const key of ["form", "data", "value"] as const) {
    const candidate = raw[key];
    if (isRecord(candidate) && Array.isArray(candidate.content)) {
      return candidate;
    }
  }

  if (Array.isArray((raw as { content?: unknown }).content)) {
    return raw;
  }

  return null;
}

function looksLikeFormContent(raw: unknown): boolean {
  return extractFormRecord(raw) !== null;
}

function parseFormContent(field: CmsContentField): FormContentField {
  const source = extractFormRecord(field.content) ?? {};

  const content = Array.isArray(source.content)
    ? (source.content as BuilderField[])
    : [];

  const description =
    typeof source.description === "string" ? source.description : null;

  return {
    id: field.id,
    type: "form",
    fieldKey: field.field_key,
    order: field.order,
    content: {
      id: typeof source.id === "string" ? source.id : field.id,
      name:
        (typeof source.name === "string" && source.name) ||
        (typeof field.field_key === "string" && field.field_key) ||
        "Form",
      description,
      published:
        typeof source.published === "boolean" ? source.published : true,
      share_url:
        typeof source.share_url === "string"
          ? source.share_url
          : typeof source.shareUrl === "string"
            ? source.shareUrl
            : "",
      content,
      submitLabel:
        typeof source.submitLabel === "string"
          ? source.submitLabel
          : typeof source.submit_label === "string"
            ? source.submit_label
            : undefined,
      successMessage:
        typeof source.successMessage === "string"
          ? source.successMessage
          : typeof source.success_message === "string"
            ? source.success_message
            : undefined,
    },
  };
}

export function normalizeCmsContentField(field: CmsContentField): RenderableContentField {
  switch (field.type) {
    case "text":
      return parseTextContent(field);
    case "richtext":
      return parseRichTextContent(field);
    case "boolean":
      return parseBooleanContent(field);
    case "button":
      return parseButtonContent(field);
    case "date":
      return parseDateContent(field);
    case "image":
      return parseImageContent(field);
    case "reference":
      return parseReferenceContent(field);
    case "video":
      return parseVideoContent(field);
    case "section":
      return parseSectionContent(field);
    case "social_media":
      return parseSocialMediaContent(field);
    case "navigation_menu":
      return parseNavigationMenuContent(field);
    case "form":
      return parseFormContent(field);
    default:
      // Unknown CMS block types that carry a form-shaped payload (for example
      // when a project names its block `contact_form` or `newsletter_form`)
      // are normalized to the `form` field so the registry renders them.
      if (looksLikeFormContent(field.content)) {
        return parseFormContent(field);
      }

      return {
        id: field.id,
        type: field.type,
        content: field.content,
        order: field.order,
        fieldKey: field.field_key,
      };
  }
}
