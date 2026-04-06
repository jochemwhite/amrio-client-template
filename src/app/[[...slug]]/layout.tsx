import type { ReactNode } from "react";

import { CmsDefaultLayout } from "@/components/cms/layout-renderer";
import { CmsApiError, getDefaultLayoutsCached } from "@/lib/cms";
import type { CmsLayoutEntry } from "@/types/cms";

async function loadDefaultLayoutEntries(): Promise<CmsLayoutEntry[]> {
  try {
    const response = await getDefaultLayoutsCached();
    return response.layout.entries ?? [];
  } catch (error) {
    if (error instanceof CmsApiError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

export default async function CmsRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const entries = await loadDefaultLayoutEntries();

  if (entries.length === 0) {
    return children;
  }

  return <CmsDefaultLayout entries={entries}>{children}</CmsDefaultLayout>;
}
