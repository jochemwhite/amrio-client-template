import { ContentLink } from "@/components/content/content-link";
import type {
  NavigationMenuContentField,
  NavigationMenuItem,
} from "@/types/content";

function NavigationItems({
  items,
  depth = 0,
}: {
  items: NavigationMenuItem[];
  depth?: number;
}) {
  return (
    <ul
      className={`list-none ${
        depth === 0
          ? "grid gap-3 p-0"
          : "mt-2 grid gap-2 border-l border-[var(--color-border)] pl-4"
      }`}
    >
      {items.map((item) => (
        <li key={item.id} className="grid gap-1">
          {item.href ? (
            <ContentLink
              className="text-[var(--color-secondary)] transition-colors hover:text-[var(--color-secondary-strong)]"
              href={item.href}
            >
              {item.label}
            </ContentLink>
          ) : (
            <span className="font-semibold text-[var(--color-foreground)]">
              {item.label}
            </span>
          )}
          {item.children?.length ? (
            <NavigationItems items={item.children} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function NavigationMenuField({
  field,
}: {
  field: NavigationMenuContentField;
}) {
  const content = field.content ?? {};
  const items = content.items ?? [];

  if (items.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No navigation items provided.</p>;
  }

  return (
    <nav className="grid gap-3" aria-label={content.title ?? "Navigation"}>
      {content.title ? (
        <p className="text-lg font-semibold text-[var(--color-foreground)]">
          {content.title}
        </p>
      ) : null}
      <NavigationItems items={items} />
    </nav>
  );
}
