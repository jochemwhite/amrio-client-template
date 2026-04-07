import { ContentFieldsRenderer } from "@/components/content/content-renderer";
import { getFieldByKey } from "@/components/content/utils";

import {
  getRenderableFields,
  type CmsSectionComponentProps,
} from "./shared";

export function HeroSection({ section }: CmsSectionComponentProps) {
  const fields = getRenderableFields(section);
  const backgroundImage = getFieldByKey(fields, "background_image", "image");

  return (
    <section
      className="overflow-hidden rounded-4xl border border-border px-6 py-8 md:px-10 md:py-12"
      data-section-type={section.type}
      style={
        backgroundImage?.content.src
          ? {
              backgroundImage: `linear-gradient(135deg, var(--hero-overlay-start) 0%, var(--hero-overlay-middle) 45%, var(--hero-overlay-end) 100%), url(${backgroundImage.content.src})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : {
              background:
                "linear-gradient(135deg, var(--surface) 0%, var(--secondary-soft) 45%, var(--accent-soft) 100%)",
            }
      }
    >
      <div className="grid gap-6">
        <ContentFieldsRenderer
          fields={fields}
          emptyLabel="This hero section currently has no fields."
          showFieldMeta={false}
        />
      </div>
    </section>
  );
}
