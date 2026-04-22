import { Input } from "@/components/ui/input";
import type { PhoneBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderPhoneField: SubmissionFieldRenderer<
  PhoneBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="tel"
    inputMode="tel"
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    autoComplete="tel"
    {...rhf.register(block.key)}
  />
);
