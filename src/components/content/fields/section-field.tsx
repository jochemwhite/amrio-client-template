import { sortByOrder } from "@/components/content/utils";
import type { RenderableContentField, SectionContentField } from "@/types/content";

export function SectionField({
  field,
  depth = 0,
  renderField,
}: {
  field: SectionContentField;
  depth?: number;
  renderField: (
    field: RenderableContentField,
    options?: { depth?: number },
  ) => React.ReactNode;
}) {
  const content = field.content ?? {};
  const children = sortByOrder(content.children ?? []);

  return (
    <section className="rounded-xl border border-border bg-surface-muted p-4">
      <div className="grid gap-3">
        {content.title ? (
          <h3 className="text-lg font-semibold text-foreground">
            {content.title}
          </h3>
        ) : null}
        {content.description ? (
          <p className="text-muted">{content.description}</p>
        ) : null}
        {children.length === 0 ? (
          <p className="text-sm text-muted">This section has no child fields yet.</p>
        ) : (
          <div
            className={
              content.layout === "grid"
                ? "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]"
                : "grid gap-4"
            }
          >
            {children.map((child) => renderField(child, { depth: depth + 1 }))}
          </div>
        )}
      </div>
    </section>
  );
}
