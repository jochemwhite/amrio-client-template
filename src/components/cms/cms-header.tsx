import { ContentImage } from "@/components/content/content-image";
import { ContentLink } from "@/components/content/content-link";
import { getFieldByKey, sortByOrder } from "@/components/content/utils";
import type { CmsLayoutEntry } from "@/types/cms";

import { getRenderableFields, normalizeHref } from "./layout-shared";

export function CmsHeader({ entry }: { entry: CmsLayoutEntry }) {
  const headerSection = sortByOrder(entry.sections)[0];

  if (!headerSection) {
    return null;
  }

  const fields = getRenderableFields(headerSection);
  const title = getFieldByKey(fields, "title", "text");
  const logo = getFieldByKey(fields, "logo_img", "image");
  const navigation = getFieldByKey(fields, "nav", "navigation_menu");
  const items = navigation?.content.items ?? [];

  return (
    <header
      className="border-b border-slate-200 bg-white/95 backdrop-blur top-0 sticky z-50"
      data-layout-entry={entry.name}
    >
      <div className="container mx-auto flex flex-col gap-6 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <ContentLink className="flex items-center gap-3" href="/">
          {logo?.content.src ? (
            <ContentImage
              alt={logo.content.alt ?? title?.content.text ?? entry.name}
              className="h-11 w-11 rounded-full object-contain"
              height={44}
              src={logo.content.src}
              width={44}
            />
          ) : null}
          <span className="text-lg font-semibold tracking-tight text-slate-950">
            {title?.content.text ?? entry.name}
          </span>
        </ContentLink>

        {items.length > 0 ? (
          <nav aria-label={navigation?.content.title ?? "Main navigation"}>
            <ul className="flex flex-wrap items-center gap-5">
              {items.map((item) => {
                const href = normalizeHref(item.href) ?? "#";

                return (
                  <li key={item.id}>
                    <ContentLink
                      className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
                      href={href}
                    >
                      {item.label}
                    </ContentLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
