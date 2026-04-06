import type { ReactNode } from "react";

import { CmsFooter } from "@/components/cms/cms-footer";
import { CmsHeader } from "@/components/cms/cms-header";
import { getLayoutByName } from "@/components/cms/layout-shared";
import type { CmsLayoutEntry } from "@/types/cms";

export function CmsDefaultLayout({
  children,
  entries,
}: {
  children: ReactNode;
  entries: CmsLayoutEntry[];
}) {
  const header = getLayoutByName(entries, "header");
  const footer = getLayoutByName(entries, "footer");

  return (
    <>
      {header ? <CmsHeader entry={header} /> : null}
      {children}
      {footer ? <CmsFooter entry={footer} /> : null}
    </>
  );
}
