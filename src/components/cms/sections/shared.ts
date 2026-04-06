import { normalizeCmsContentField } from "@/components/content/cms-adapter";
import { sortByOrder } from "@/components/content/utils";
import type { CmsContentSection } from "@/types/cms";

export type CmsSectionComponentProps = {
  section: CmsContentSection;
};

export type CmsSectionComponent = (
  props: CmsSectionComponentProps,
) => React.JSX.Element;

export const sectionStackClass = "grid gap-6";
export const sectionEyebrowClass =
  "inline-block text-xs leading-none font-medium tracking-[0.08em] text-slate-500 uppercase";
export const sectionSubtleClass = "text-slate-600";

export function getRenderableFields(section: CmsContentSection) {
  return sortByOrder(section.fields).map(normalizeCmsContentField);
}
