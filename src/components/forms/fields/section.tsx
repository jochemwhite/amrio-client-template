import * as React from "react";

import type { SectionBuilderField } from "@/types/form-builder";

import type { LayoutBlockRenderer } from "./types";

export const renderSectionBlock: LayoutBlockRenderer<SectionBuilderField> = ({
  block,
  renderChild,
}) => {
  const children = block.children ?? [];

  return (
    <section
      className="col-span-full flex flex-col gap-3 rounded-md border border-form-control-border bg-form-control p-4"
      aria-labelledby={block.title ? `${block.id}-title` : undefined}
    >
      {block.title ? (
        <h3
          id={`${block.id}-title`}
          className="text-base font-semibold text-form-label"
        >
          {block.title}
        </h3>
      ) : null}
      {block.description ? (
        <p className="text-sm text-form-description">{block.description}</p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        {children.map((child) => (
          <React.Fragment key={child.id}>{renderChild(child)}</React.Fragment>
        ))}
      </div>
    </section>
  );
};
