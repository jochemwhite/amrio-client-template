import { Input } from "@/components/ui/input";
import type { EmailBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderEmailField: SubmissionFieldRenderer<
  EmailBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="email"
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    autoComplete="email"
    inputMode="email"
    {...rhf.register(block.key)}
  />
);
