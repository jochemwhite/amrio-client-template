import { Input } from "@/components/ui/input";
import type { TextBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderTextField: SubmissionFieldRenderer<
  TextBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="text"
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    {...rhf.register(block.key)}
  />
);
