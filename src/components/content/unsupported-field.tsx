import { formatUnknownContent, getFieldLabel } from "@/components/content/utils";
import type { RenderableContentField } from "@/types/content";

export function UnsupportedField({
  field,
}: {
  field: RenderableContentField;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted">
        No renderer is registered for{" "}
        <span className="rounded-md bg-surface-muted px-1.5 py-0.5 font-mono text-sm">
          {field.type}
        </span>
        .
      </p>
      <dl className="grid gap-1">
        <dt className="text-xs tracking-[0.08em] text-subtle uppercase">
          Label
        </dt>
        <dd>{getFieldLabel(field)}</dd>
        <dt className="text-xs tracking-[0.08em] text-subtle uppercase">
          Content
        </dt>
        <dd>
          <pre className="whitespace-pre-wrap break-words">
            {formatUnknownContent(field.content)}
          </pre>
        </dd>
      </dl>
    </div>
  );
}
