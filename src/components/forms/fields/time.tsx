import { Input } from "@/components/ui/input";
import type { TimeBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderTimeField: SubmissionFieldRenderer<
  TimeBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="time"
    readOnly={block.readOnly}
    min={block.minTime}
    max={block.maxTime}
    {...rhf.register(block.key)}
  />
);
