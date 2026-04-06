import { renderCmsSection } from "@/components/cms/section-registry";
import { sortByOrder } from "@/components/content/utils";
import type { CmsFullPageData } from "@/types/cms";

const stackClass = "grid gap-6";

export function CmsPageView({ page }: { page: CmsFullPageData }) {
  const sections = sortByOrder(page.sections);

  return (
    <section>
      <div className={stackClass}>
        {sections.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">This page currently has no sections.</p>
        ) : (
          sections.map((section) => <div key={section.id}>{renderCmsSection(section)}</div>)
        )}
      </div>
    </section>
  );
}
