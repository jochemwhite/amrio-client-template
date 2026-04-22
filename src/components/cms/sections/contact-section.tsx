import { ContentFieldsRenderer } from "@/components/content/content-renderer";
import { getRenderableFields, type CmsSectionComponentProps } from "./shared";

export function ContactSection({ section }: CmsSectionComponentProps) {
  const fields = getRenderableFields(section);
  return (
    <section
      data-section-type={section.type}
      className=""
    >
      {fields.map((field) => (
        <div key={field.id}>
          <ContentFieldsRenderer
            fields={[field]}
            depth={0}
            showFieldMeta={false}
          />
        </div>
      ))}
    </section>
  );
}
