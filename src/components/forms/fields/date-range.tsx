import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { DateRangeBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderDateRangeField: SubmissionFieldRenderer<
  DateRangeBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => {
      const value = (field.value ?? { from: "", to: "" }) as {
        from?: string | null;
        to?: string | null;
      };

      return (
        <div id={fieldId} className="grid gap-2 sm:grid-cols-2">
          <Input
            type="date"
            aria-label="From"
            min={block.minDate}
            max={block.maxDate}
            readOnly={block.readOnly}
            value={value.from ?? ""}
            onChange={(event) =>
              field.onChange({ ...value, from: event.target.value })
            }
            onBlur={field.onBlur}
          />
          <Input
            type="date"
            aria-label="To"
            min={block.minDate}
            max={block.maxDate}
            readOnly={block.readOnly}
            value={value.to ?? ""}
            onChange={(event) =>
              field.onChange({ ...value, to: event.target.value })
            }
            onBlur={field.onBlur}
          />
        </div>
      );
    }}
  />
);
