import { ContentFieldsRenderer } from "@/components/content/content-renderer";

import {
  getRenderableFields,
  type CmsSectionComponentProps
} from "./shared";

export function DefaultSection({ section }: CmsSectionComponentProps) {
  const fields = getRenderableFields(section);

  return (
    <section
      className="container mx-auto py-12"
      data-section-type={section.type}
    >
      <ContentFieldsRenderer
        fields={fields}
        emptyLabel="This section currently has no fields."
        showFieldMeta={false}
      />
    </section>
  );
}
