import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import type { FileBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderFileField: SubmissionFieldRenderer<
  FileBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => (
      <Input
        id={fieldId}
        type="file"
        accept={block.accept}
        multiple={block.multiple}
        disabled={block.readOnly}
        onBlur={field.onBlur}
        onChange={(event) => {
          const files = event.target.files;
          if (!files) {
            field.onChange(null);
            return;
          }
          const list = Array.from(files);
          field.onChange(block.multiple ? list : (list[0] ?? null));
        }}
      />
    )}
  />
);
