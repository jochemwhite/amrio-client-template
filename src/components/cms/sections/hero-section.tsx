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
      className="overflow-hidden rounded-4xl border border-[var(--color-border)] px-6 py-8 md:px-10 md:py-12"
      data-section-type={section.type}
      style={
        backgroundImage?.content.src
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(248,250,252,0.88) 0%, rgba(224,242,254,0.82) 45%, rgba(254,243,199,0.78) 100%), url(${backgroundImage.content.src})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : {
              background:
                "linear-gradient(135deg, var(--color-surface) 0%, var(--color-secondary-soft) 45%, var(--color-accent-soft) 100%)",
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
