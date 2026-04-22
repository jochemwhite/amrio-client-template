import type { DividerBuilderField } from "@/types/form-builder";

import type { LayoutBlockRenderer } from "./types";

export const renderDividerBlock: LayoutBlockRenderer<DividerBuilderField> = () => (
  <hr className="col-span-full border-form-control-border" />
);
