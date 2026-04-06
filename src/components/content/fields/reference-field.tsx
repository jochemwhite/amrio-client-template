import { ContentImage } from "@/components/content/content-image";
import { ContentLink } from "@/components/content/content-link";
import type { ReferenceContentField } from "@/types/content";

export function ReferenceField({ field }: { field: ReferenceContentField }) {
  const content = field.content ?? {};
  const items = content.items ?? [];
  const title = content.title?.trim();

  if (items.length > 0) {
    return (
      <div className="grid gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:grid-cols-[72px_1fr]"
          >
            {item.thumbnailSrc ? (
              <ContentImage
                alt=""
                className="h-[72px] w-[72px] rounded-lg object-cover"
                height={72}
                src={item.thumbnailSrc}
                width={72}
              />
            ) : null}
            <div className="grid gap-3">
              {item.href ? (
                <ContentLink
                  className="text-lg font-semibold text-[var(--color-secondary)] transition-colors hover:text-[var(--color-secondary-strong)]"
                  href={item.href}
                >
                  {item.title ?? "Untitled reference"}
                </ContentLink>
              ) : (
                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                  {item.title ?? "Untitled reference"}
                </h3>
              )}
              {item.meta ? (
                <p className="text-sm text-[var(--color-text-subtle)]">{item.meta}</p>
              ) : null}
              {item.description ? (
                <p className="text-[var(--color-text-muted)]">{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (!title && !content.description) {
    return <p className="text-sm text-[var(--color-text-muted)]">No reference content available.</p>;
  }

  const body = (
    <article className="grid items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:grid-cols-[72px_1fr]">
      {content.thumbnailSrc ? (
        <ContentImage
          alt=""
          className="h-[72px] w-[72px] rounded-lg object-cover"
          height={72}
          src={content.thumbnailSrc}
          width={72}
        />
      ) : null}
      <div className="grid gap-3">
        {title ? (
          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </h3>
        ) : null}
        {content.meta ? (
          <p className="text-sm text-[var(--color-text-subtle)]">{content.meta}</p>
        ) : null}
        {content.description ? (
          <p className="text-[var(--color-text-muted)]">{content.description}</p>
        ) : null}
      </div>
    </article>
  );

  if (content.href) {
    return (
      <ContentLink
        className="block text-[var(--color-secondary)] transition-colors hover:text-[var(--color-secondary-strong)]"
        href={content.href}
      >
        {body}
      </ContentLink>
    );
  }

  return body;
}
