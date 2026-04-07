import { CmsOutageState } from "@/components/app/route-status";
import type { ReactNode } from "react";

import { CmsDefaultLayout } from "@/components/cms/layout-renderer";
import { CmsApiError, getDefaultLayoutsCached } from "@/lib/cms";
import type { CmsLayoutEntry } from "@/types/cms";

export const revalidate = 3600;

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
  let entries: CmsLayoutEntry[];

  try {
    entries = await loadDefaultLayoutEntries();
  } catch (error) {
    console.error("Failed to load CMS layout entries.", error);

    return (
      <>
        <div className="border-b border-border bg-surface-muted/60 px-4 py-3 text-sm text-muted">
          Shared CMS layout content is temporarily unavailable.
        </div>
        <CmsOutageState
          title="Shared CMS layout is unavailable"
          description="The page content may still recover later, but the CMS header and footer could not be loaded for this request."
        />
        {children}
      </>
    );
  }

  if (entries.length === 0) {
    return children;
  }

  return <CmsDefaultLayout entries={entries}>{children}</CmsDefaultLayout>;
}
