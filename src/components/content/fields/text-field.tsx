import { getTextAlignClass } from "@/components/content/utils";
import type { TextContentField } from "@/types/content";

const variantClassMap: Record<
  NonNullable<TextContentField["content"]["variant"]>,
  string
> = {
  heading:
    "text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] font-semibold tracking-tight text-foreground",
  subheading: "text-lg font-semibold leading-6 text-foreground",
  body: "text-base leading-7 text-foreground",
  caption: "text-sm text-muted",
  eyebrow:
    "text-xs leading-none font-medium tracking-[0.08em] text-subtle uppercase",
};

export function TextField({ field }: { field: TextContentField }) {
  const content = field.content ?? {};
  const text = content.text?.trim();
  const variant = content.variant ?? "body";

  if (!text) {
    return <p className="text-sm text-muted">No text provided.</p>;
  }

  return (
    <div className={getTextAlignClass(content.align)}>
      <p className={variantClassMap[variant]}>{text}</p>
    </div>
  );
}
