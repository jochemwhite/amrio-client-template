import { ContentImage } from "@/components/content/content-image";
import type { ImageContentField } from "@/types/content";

export function ImageField({ field }: { field: ImageContentField }) {
  const content = field.content ?? {};

  if (!content.src) {
    return (
      <figure className="grid gap-3">
        <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border bg-surface-muted text-muted">
          Image unavailable
        </div>
      </figure>
    );
  }

  return (
    <figure className="grid gap-3">
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-surface-muted"
        style={
          content.aspectRatio ? { aspectRatio: content.aspectRatio } : undefined
        }
      >
        <ContentImage
          alt={content.alt ?? ""}
          className="block h-full w-full"
          fill={content.aspectRatio != null}
          height={content.height}
          objectFit={content.objectFit}
          sizes="(max-width: 768px) 100vw, 960px"
          src={content.src}
          width={content.width}
        />
      </div>
      {content.caption ? (
        <figcaption className="text-sm text-muted">
          {content.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
