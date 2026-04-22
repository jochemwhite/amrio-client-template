import { Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderCheckboxField: SubmissionFieldRenderer<
  CheckboxBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => (
      <label className="inline-flex items-center gap-2 text-sm text-form-label">
        <Checkbox
          id={fieldId}
          checked={Boolean(field.value)}
          disabled={block.readOnly}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          onBlur={field.onBlur}
        />
        {block.placeholder ? <span>{block.placeholder}</span> : null}
      </label>
    )}
  />
);
