import { Controller } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import type { MultiSelectBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderMultiSelectField: SubmissionFieldRenderer<
  MultiSelectBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => {
      const current = Array.isArray(field.value)
        ? (field.value as string[])
        : [];

      const toggle = (value: string, checked: boolean) => {
        const next = checked
          ? Array.from(new Set([...current, value]))
          : current.filter((item) => item !== value);
        field.onChange(next);
      };

      return (
        <div id={fieldId} role="group" className="flex flex-col gap-2">
          {(block.options ?? []).map((option) => {
            const optionId = `${fieldId}-${option.value}`;
            const checked = current.includes(option.value);
            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className="inline-flex items-center gap-2 text-sm text-form-label"
              >
                <Checkbox
                  id={optionId}
                  checked={checked}
                  disabled={option.disabled || block.readOnly}
                  onCheckedChange={(next) => toggle(option.value, next === true)}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      );
    }}
  />
);
