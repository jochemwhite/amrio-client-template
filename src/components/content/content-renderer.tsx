import { getContentFieldComponent } from "@/components/content/registry";
import { UnsupportedField } from "@/components/content/unsupported-field";
import { getFieldLabel, sortByOrder } from "@/components/content/utils";
import type { RenderableContentField } from "@/types/content";

export function renderContentField(
  field: RenderableContentField,
  options?: {
    depth?: number;
    isLoading?: boolean;
    showFieldMeta?: boolean;
    onAction?: (
      actionId: string,
      field: RenderableContentField,
    ) => void | Promise<void>;
  },
) {
  const Component = getContentFieldComponent(field.type);
  const depth = options?.depth ?? 0;
  const showFieldMeta = options?.showFieldMeta ?? true;

  return (
    <article
      key={field.id}
      className={
        showFieldMeta
          ? "overflow-hidden rounded-2xl border border-border bg-surface"
          : "bg-transparent"
      }
      data-field-type={field.type}
      data-field-depth={depth}
    >
      {showFieldMeta ? (
        <header className="flex items-center justify-between gap-4 border-b border-border bg-surface-muted/80 px-4 py-3">
          <p className="text-sm font-semibold">{getFieldLabel(field)}</p>
          <p className="text-xs tracking-[0.08em] text-subtle uppercase">
            {field.type}
          </p>
        </header>
      ) : null}
      <div className={showFieldMeta ? "p-4" : ""}>
        {Component ? (
          <Component
            field={field}
            depth={depth}
            isLoading={options?.isLoading}
            onAction={options?.onAction}
            renderField={(nextField, nextOptions) =>
              renderContentField(nextField, {
                ...options,
                depth: nextOptions?.depth ?? depth + 1,
              })
            }
          />
        ) : (
          <UnsupportedField field={field} />
        )}
      </div>
    </article>
  );
}

export function ContentFieldsRenderer({
  fields,
  emptyLabel = "No fields available.",
  depth = 0,
  showFieldMeta = true,
}: {
  fields: RenderableContentField[];
  emptyLabel?: string;
  depth?: number;
  showFieldMeta?: boolean;
}) {
  const orderedFields = sortByOrder(fields);

  if (orderedFields.length === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-4">
      {orderedFields.map((field) =>
        renderContentField(field, { depth, showFieldMeta }),
      )}
    </div>
  );
}
