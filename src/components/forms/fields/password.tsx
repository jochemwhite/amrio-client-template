import { Input } from "@/components/ui/input";
import type { PasswordBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderPasswordField: SubmissionFieldRenderer<
  PasswordBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="password"
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    autoComplete="new-password"
    {...rhf.register(block.key)}
  />
);
