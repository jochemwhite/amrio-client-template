import type { ElementType } from "react";

import { ContentLink } from "@/components/content/content-link";
import { isRecord } from "@/components/content/utils";
import type {
  RichTextBlock,
  RichTextContentField,
  RichTextSpan,
} from "@/types/content";

function renderSpan(span: RichTextSpan, index: number) {
  let child: React.ReactNode = span.text;

  if (span.marks?.code) {
    child = (
      <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-foreground)]">
        {child}
      </code>
    );
  }

  if (span.marks?.bold) {
    child = <strong>{child}</strong>;
  }

  if (span.marks?.italic) {
    child = <em>{child}</em>;
  }

  if (span.marks?.underline) {
    child = <span className="underline">{child}</span>;
  }

  if (span.href) {
    child = (
      <ContentLink
        className="text-[var(--color-secondary)] transition-colors hover:text-[var(--color-secondary-strong)]"
        href={span.href}
      >
        {child}
      </ContentLink>
    );
  }

  return <span key={`${span.text}-${index}`}>{child}</span>;
}

function renderInline(spans?: RichTextSpan[]) {
  if (!spans?.length) {
    return null;
  }

  return spans.map((span, index) => renderSpan(span, index));
}

function renderBlock(block: RichTextBlock, index: number) {
  switch (block.type) {
    case "heading": {
      const level = block.level ?? 2;
      const Tag = `h${level}` as ElementType;

      return (
        <Tag key={`block-${index}`} className="text-xl font-semibold leading-tight">
          {renderInline(block.spans)}
        </Tag>
      );
    }
    case "blockquote":
      return (
        <blockquote
          key={`block-${index}`}
          className="border-l-[3px] border-[var(--color-border)] pl-4 text-[var(--color-text-muted)]"
        >
          {renderInline(block.spans)}
        </blockquote>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";

      return (
        <Tag key={`block-${index}`} className="space-y-2 pl-5 leading-7">
          {block.items?.map((item, itemIndex) => (
            <li key={`item-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </Tag>
      );
    }
    default:
      return (
        <p key={`block-${index}`} className="text-base leading-7 text-[var(--color-foreground)]">
          {renderInline(block.spans)}
        </p>
      );
  }
}

export function RichTextField({ field }: { field: RichTextContentField }) {
  const content = field.content ?? {};

  if (Array.isArray(content.blocks) && content.blocks.length > 0) {
    return (
      <div className="grid gap-4">
        {content.blocks
          .filter(isRecord)
          .map((block, index) => renderBlock(block as RichTextBlock, index))}
      </div>
    );
  }

  if (typeof content.plainText === "string" && content.plainText.trim()) {
    return (
      <div className="grid gap-4">
        <p className="text-base leading-7 text-[var(--color-foreground)]">
          {content.plainText}
        </p>
      </div>
    );
  }

  if (typeof content.html === "string" && content.html.trim()) {
    return (
      <div className="grid gap-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          HTML content received. Swap in your preferred rich text renderer here.
        </p>
      </div>
    );
  }

  return <p className="text-sm text-[var(--color-text-muted)]">No rich text content provided.</p>;
}
