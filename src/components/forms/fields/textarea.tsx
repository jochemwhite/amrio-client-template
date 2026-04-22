import { Textarea } from "@/components/ui/textarea";
import type { TextareaBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderTextareaField: SubmissionFieldRenderer<
  TextareaBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Textarea
    id={fieldId}
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    rows={block.rows}
    {...rhf.register(block.key)}
  />
);
