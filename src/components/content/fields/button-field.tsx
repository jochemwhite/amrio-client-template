import { ContentLink } from "@/components/content/content-link";
import type {
  ButtonContentField,
  RenderableContentField,
} from "@/types/content";

export function ButtonField({
  field,
  onAction,
}: {
  field: ButtonContentField;
  onAction?: (
    actionId: string,
    field: RenderableContentField,
  ) => void | Promise<void>;
}) {
  const content = field.content ?? {};
  const label = content.label?.trim();
  const variant = content.variant ?? "primary";

  if (!label) {
    return <p className="text-sm text-[var(--color-text-muted)]">No button label provided.</p>;
  }

  const className = {
    primary:
      "inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-strong)]",
    secondary:
      "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-strong)]",
    ghost:
      "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-transparent px-4 py-3 font-semibold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)]",
  }[variant];

  if (content.href) {
    return (
      <ContentLink
        className={className}
        href={content.href}
        target={content.target}
      >
        {label}
      </ContentLink>
    );
  }

  if (content.actionId && onAction) {
    return (
      <button
        className={className}
        type="button"
        onClick={() => onAction(content.actionId!, field)}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      className={`${className} cursor-not-allowed opacity-65`}
      type="button"
      disabled
    >
      {label}
    </button>
  );
}
