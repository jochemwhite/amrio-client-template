import { Controller } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import type { ToggleBuilderField } from "@/types/form-builder";

import type { SubmissionFieldRenderer } from "./types";

export const renderToggleField: SubmissionFieldRenderer<
  ToggleBuilderField & { key: string }
> = ({ block, rhf, fieldId }) => (
  <Controller
    control={rhf.control}
    name={block.key}
    render={({ field }) => (
      <Switch
        id={fieldId}
        checked={Boolean(field.value)}
        disabled={block.readOnly}
        onCheckedChange={field.onChange}
      />
    )}
  />
);
