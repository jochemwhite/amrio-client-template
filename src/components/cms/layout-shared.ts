import { normalizeCmsContentField } from "@/components/content/cms-adapter";
import { sortByOrder } from "@/components/content/utils";
import type { CmsContentSection, CmsLayoutEntry } from "@/types/cms";

export function getLayoutByName(entries: CmsLayoutEntry[], name: string) {
  return entries.find((entry) => entry.name.trim().toLowerCase().includes(name));
}

export function getRenderableFields(section: CmsContentSection) {
  return sortByOrder(section.fields).map(normalizeCmsContentField);
}

export function normalizeHref(href?: string) {
  if (!href) {
    return undefined;
  }

  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  ) {
    return href;
  }

  return `/${href.replace(/^\/+/, "")}`;
}
