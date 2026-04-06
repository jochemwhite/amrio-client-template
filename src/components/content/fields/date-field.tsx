import { formatDateContent } from "@/components/content/utils";
import type { DateContentField } from "@/types/content";

export function DateField({ field }: { field: DateContentField }) {
  const formatted = formatDateContent(field.content);

  if (!formatted) {
    return <p className="text-sm text-[var(--color-text-muted)]">No date available.</p>;
  }

  return (
    <time
      className="text-base leading-7 text-[var(--color-foreground)]"
      dateTime={field.content.value ?? undefined}
    >
      {formatted}
    </time>
  );
}
