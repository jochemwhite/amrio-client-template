import { CmsEmptyState } from "@/components/app/route-status";
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
          <CmsEmptyState />
        ) : (
          sections.map((section) => <div key={section.id}>{renderCmsSection(section)}</div>)
        )}
      </div>
    </section>
  );
}
