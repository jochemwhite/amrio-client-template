import { ContentFieldsRenderer } from "@/components/content/content-renderer";

import {
  getRenderableFields,
  sectionEyebrowClass,
  sectionStackClass,
  sectionSubtleClass,
  type CmsSectionComponentProps,
} from "./shared";

export function DefaultSection({ section }: CmsSectionComponentProps) {
  const fields = getRenderableFields(section);

  return (
    <section className="container mx-auto py-12" data-section-type={section.type}>
      <div className={sectionStackClass}>
        <div>
          <p className={sectionEyebrowClass}>{section.type}</p>
          <h2 className="text-2xl font-semibold">{section.name}</h2>
          <p className={sectionSubtleClass}>
            Order: {section.order ?? "Not set"} | Fields: {fields.length}
          </p>
        </div>
        <ContentFieldsRenderer
          fields={fields}
          emptyLabel="This section currently has no fields."
          showFieldMeta={false}
        />
      </div>
    </section>
  );
}
