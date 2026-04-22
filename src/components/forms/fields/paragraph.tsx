import type { ParagraphBuilderField } from "@/types/form-builder";

import type { LayoutBlockRenderer } from "./types";

export const renderParagraphBlock: LayoutBlockRenderer<ParagraphBuilderField> = ({
  block,
}) => (
  <p className="col-span-full text-sm text-form-description">
    {block.text ?? block.label ?? ""}
  </p>
);
