import { Controller } from "react-hook-form";

import type { RangeBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderRangeField: SubmissionFieldRenderer<
  RangeBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => {
      const numeric =
        typeof field.value === "number"
          ? field.value
          : Number(field.value) || 0;

      return (
        <div className="flex items-center gap-3">
          <input
            id={fieldId}
            type="range"
            min={block.min}
            max={block.max}
            step={block.step}
            disabled={block.readOnly}
            value={numeric}
            onChange={(event) => field.onChange(Number(event.target.value))}
            onBlur={field.onBlur}
            className="h-2 w-full cursor-pointer accent-[var(--form-control-ring)]"
          />
          <span className="min-w-[3ch] text-sm tabular-nums text-form-description">
            {numeric}
          </span>
        </div>
      );
    }}
  />
);
