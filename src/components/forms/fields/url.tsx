import { Input } from "@/components/ui/input";
import type { UrlBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderUrlField: SubmissionFieldRenderer<
  UrlBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Input
    id={fieldId}
    type="url"
    placeholder={block.placeholder}
    readOnly={block.readOnly}
    inputMode="url"
    autoComplete="url"
    {...rhf.register(block.key)}
  />
);
