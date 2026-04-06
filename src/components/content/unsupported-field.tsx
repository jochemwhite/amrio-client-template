import { formatUnknownContent, getFieldLabel } from "@/components/content/utils";
import type { RenderableContentField } from "@/types/content";

export function UnsupportedField({
  field,
}: {
  field: RenderableContentField;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-slate-600">
        No renderer is registered for{" "}
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
          {field.type}
        </span>
        .
      </p>
      <dl className="grid gap-1">
        <dt className="text-xs tracking-[0.08em] text-slate-500 uppercase">
          Label
        </dt>
        <dd>{getFieldLabel(field)}</dd>
        <dt className="text-xs tracking-[0.08em] text-slate-500 uppercase">
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
