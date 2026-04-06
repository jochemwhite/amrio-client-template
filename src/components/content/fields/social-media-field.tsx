import { ContentLink } from "@/components/content/content-link";
import type { SocialMediaContentField } from "@/types/content";

export function SocialMediaField({ field }: { field: SocialMediaContentField }) {
  const content = field.content ?? {};
  const links = content.links ?? [];

  if (links.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No social links configured.</p>;
  }

  return (
    <div className="grid gap-3">
      {content.title ? (
        <p className="text-lg font-semibold text-[var(--color-foreground)]">
          {content.title}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.id}>
            <ContentLink
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)]"
              href={link.href}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold text-[var(--color-primary-strong)]">
                {link.label.slice(0, 1).toUpperCase()}
              </span>
              <span>{link.label}</span>
            </ContentLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
