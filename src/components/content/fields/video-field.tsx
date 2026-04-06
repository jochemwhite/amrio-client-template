import type { VideoContentField } from "@/types/content";

export function VideoField({ field }: { field: VideoContentField }) {
  const content = field.content ?? {};

  if (!content.embedUrl && !content.src) {
    return (
      <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
        Video unavailable
      </div>
    );
  }

  return (
    <figure className="grid gap-3">
      <div
        className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]"
        style={
          content.aspectRatio ? { aspectRatio: content.aspectRatio } : undefined
        }
      >
        {content.embedUrl ? (
          <iframe
            className="block h-full w-full border-0"
            src={content.embedUrl}
            title={content.title ?? "Embedded video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="block h-full w-full"
            src={content.src}
            poster={content.poster}
            controls={content.controls ?? true}
          />
        )}
      </div>
      {content.caption ? (
        <figcaption className="text-sm text-[var(--color-text-muted)]">
          {content.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
