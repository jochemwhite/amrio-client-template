import type { BooleanContentField } from "@/types/content";

export function BooleanField({ field }: { field: BooleanContentField }) {
  const content = field.content ?? {};
  const value = content.value;
  const presentation = content.presentation ?? "badge";

  if (value == null) {
    return <p className="text-sm text-muted">No boolean value set.</p>;
  }

  const label = value ? content.trueLabel ?? "Yes" : content.falseLabel ?? "No";

  if (presentation === "text") {
    return <p className="text-base leading-7 text-foreground">{label}</p>;
  }

  if (presentation === "toggle") {
    return (
      <div className="inline-flex items-center gap-3" aria-label={label}>
        <span
          className={`flex h-6 w-11 items-center rounded-full border p-0.5 ${
            value
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface-muted"
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-surface shadow-sm transition-transform ${
              value ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
        <span className="text-muted">{label}</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${
        value
          ? "border-success bg-success/15 text-success"
          : "border-border bg-surface-muted text-muted"
      }`}
    >
      {label}
    </span>
  );
}
