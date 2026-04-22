import { Input } from "@/components/ui/input";
import type { DateBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderDateField: SubmissionFieldRenderer<
  DateBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="date"
    readOnly={block.readOnly}
    min={block.minDate}
    max={block.maxDate}
    {...rhf.register(block.key)}
  />
);
