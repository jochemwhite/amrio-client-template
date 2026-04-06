import { getTextAlignClass } from "@/components/content/utils";
import type { TextContentField } from "@/types/content";

const variantClassMap: Record<
  NonNullable<TextContentField["content"]["variant"]>,
  string
> = {
  heading:
    "text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] font-semibold tracking-tight text-[var(--color-foreground)]",
  subheading: "text-lg font-semibold leading-6 text-[var(--color-foreground)]",
  body: "text-base leading-7 text-[var(--color-foreground)]",
  caption: "text-sm text-[var(--color-text-muted)]",
  eyebrow:
    "text-xs leading-none font-medium tracking-[0.08em] text-[var(--color-text-subtle)] uppercase",
};

export function TextField({ field }: { field: TextContentField }) {
  const content = field.content ?? {};
  const text = content.text?.trim();
  const variant = content.variant ?? "body";

  if (!text) {
    return <p className="text-sm text-[var(--color-text-muted)]">No text provided.</p>;
  }

  return (
    <div className={getTextAlignClass(content.align)}>
      <p className={variantClassMap[variant]}>{text}</p>
    </div>
  );
}
