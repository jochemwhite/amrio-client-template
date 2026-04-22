import { Controller } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { RadioBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

function coerceValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

export const renderRadioField: SubmissionFieldRenderer<
  RadioBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => (
      <RadioGroup
        id={fieldId}
        value={coerceValue(field.value)}
        onValueChange={field.onChange}
        disabled={block.readOnly}
      >
        {(block.options ?? []).map((option) => {
          const optionId = `${fieldId}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="inline-flex items-center gap-2 text-sm text-form-label"
            >
              <RadioGroupItem
                id={optionId}
                value={option.value}
                disabled={option.disabled}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </RadioGroup>
    )}
  />
);
