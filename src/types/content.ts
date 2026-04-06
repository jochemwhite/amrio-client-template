import type { ReactNode } from "react";

export const CONTENT_FIELD_TYPES = [
  "text",
  "richtext",
  "boolean",
  "button",
  "date",
  "image",
  "reference",
  "video",
  "section",
  "social_media",
  "navigation_menu",
] as const;

export type ContentFieldType = (typeof CONTENT_FIELD_TYPES)[number];

export type BaseContentField<TType extends string = string, TContent = unknown> = {
  id: string;
  type: TType;
  content: TContent;
  fieldKey?: string | null;
  label?: string | null;
  order?: number | null;
};

export type TextFieldContent = {
  text?: string;
  variant?: "heading" | "subheading" | "body" | "caption" | "eyebrow";
  align?: "left" | "center" | "right";
};

export type RichTextMark = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export type RichTextSpan = {
  text: string;
  marks?: RichTextMark;
  href?: string;
};

export type RichTextBlock = {
  type: "paragraph" | "heading" | "blockquote" | "list";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  ordered?: boolean;
  spans?: RichTextSpan[];
  items?: RichTextSpan[][];
};

export type RichTextFieldContent = {
  blocks?: RichTextBlock[];
  html?: string;
  plainText?: string;
};

export type BooleanFieldContent = {
  value?: boolean | null;
  trueLabel?: string;
  falseLabel?: string;
  presentation?: "badge" | "text" | "toggle";
};

export type ButtonFieldContent = {
  label?: string;
  href?: string;
  target?: "_self" | "_blank";
  variant?: "primary" | "secondary" | "ghost";
  actionId?: string;
};

export type DateFieldContent = {
  value?: string | null;
  locale?: string;
  format?: Intl.DateTimeFormatOptions;
  emptyLabel?: string;
};

export type ImageFieldContent = {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
};

export type ReferenceFieldContent = {
  title?: string;
  description?: string;
  href?: string;
  meta?: string;
  thumbnailSrc?: string;
  items?: Array<{
    id: string;
    title?: string;
    description?: string;
    href?: string;
    meta?: string;
    thumbnailSrc?: string;
  }>;
};

export type VideoFieldContent = {
  title?: string;
  caption?: string;
  embedUrl?: string;
  src?: string;
  poster?: string;
  aspectRatio?: string;
  controls?: boolean;
};

export type SocialMediaLink = {
  id: string;
  label: string;
  href: string;
};

export type SocialMediaFieldContent = {
  title?: string;
  links?: SocialMediaLink[];
};

export type NavigationMenuItem = {
  id: string;
  label: string;
  href?: string;
  children?: NavigationMenuItem[];
};

export type NavigationMenuFieldContent = {
  title?: string;
  orientation?: "horizontal" | "vertical";
  items?: NavigationMenuItem[];
};

export type SectionFieldContent = {
  title?: string;
  description?: string;
  layout?: "stack" | "grid";
  children?: RenderableContentField[];
};

export type TextContentField = BaseContentField<"text", TextFieldContent>;
export type RichTextContentField = BaseContentField<
  "richtext",
  RichTextFieldContent
>;
export type BooleanContentField = BaseContentField<
  "boolean",
  BooleanFieldContent
>;
export type ButtonContentField = BaseContentField<"button", ButtonFieldContent>;
export type DateContentField = BaseContentField<"date", DateFieldContent>;
export type ImageContentField = BaseContentField<"image", ImageFieldContent>;
export type ReferenceContentField = BaseContentField<
  "reference",
  ReferenceFieldContent
>;
export type VideoContentField = BaseContentField<"video", VideoFieldContent>;
export type SectionContentField = BaseContentField<
  "section",
  SectionFieldContent
>;
export type SocialMediaContentField = BaseContentField<
  "social_media",
  SocialMediaFieldContent
>;
export type NavigationMenuContentField = BaseContentField<
  "navigation_menu",
  NavigationMenuFieldContent
>;

export type KnownContentField =
  | TextContentField
  | RichTextContentField
  | BooleanContentField
  | ButtonContentField
  | DateContentField
  | ImageContentField
  | ReferenceContentField
  | VideoContentField
  | SectionContentField
  | SocialMediaContentField
  | NavigationMenuContentField;

export type UnknownContentField = BaseContentField<string, unknown>;

export type RenderableContentField = KnownContentField | UnknownContentField;

export type ContentFieldComponentProps<
  TField extends RenderableContentField = RenderableContentField,
> = {
  field: TField;
  depth?: number;
  isLoading?: boolean;
  onAction?: (
    actionId: string,
    field: RenderableContentField,
  ) => void | Promise<void>;
  renderField: (
    field: RenderableContentField,
    options?: { depth?: number },
  ) => ReactNode;
};

export type ContentFieldComponent<
  TField extends RenderableContentField = RenderableContentField,
> = (props: ContentFieldComponentProps<TField>) => ReactNode;
