import { cn } from "@/lib/utils";
import type { HeadingBuilderField } from "@/types/form-builder";

import type { LayoutBlockRenderer } from "./types";

export const renderHeadingBlock: LayoutBlockRenderer<HeadingBuilderField> = ({
  block,
}) => {
  const level = block.level ?? 2;
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag
      className={cn(
        "col-span-full text-form-label",
        level <= 2 && "text-xl font-semibold",
        level === 3 && "text-lg font-semibold",
        level >= 4 && "text-base font-medium",
      )}
    >
      {block.text ?? block.label ?? ""}
    </Tag>
  );
};
