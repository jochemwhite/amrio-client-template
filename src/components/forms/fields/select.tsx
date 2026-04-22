import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

function coerceSelectValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

export const renderSelectField: SubmissionFieldRenderer<
  SelectBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => (
      <Select
        value={coerceSelectValue(field.value)}
        onValueChange={field.onChange}
        disabled={block.readOnly}
      >
        <SelectTrigger id={fieldId} onBlur={field.onBlur}>
          <SelectValue
            placeholder={block.placeholder ?? "Select an option"}
          />
        </SelectTrigger>
        <SelectContent>
          {(block.options ?? []).map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  />
);
