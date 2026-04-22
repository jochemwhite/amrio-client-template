import { Input } from "@/components/ui/input";
import type { NumberBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderNumberField: SubmissionFieldRenderer<
  NumberBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="number"
    inputMode="decimal"
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    min={block.min}
    max={block.max}
    step={block.step}
    {...rhf.register(block.key)}
  />
);
