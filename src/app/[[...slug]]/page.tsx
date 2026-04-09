import type { Metadata } from "next";
import { notFound, unstable_rethrow } from "next/navigation";

import { CmsOutageState } from "@/components/app/route-status";
import { CmsPageView } from "@/components/cms/content-renderer";
import {
  CmsApiError,
  getFullPageBySlugCached,
  getPagesCached,
} from "@/lib/cms";
import { getSlugPath } from "@/lib/cms-routes";

type CmsPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getPagesCached();

  return pages
    .filter((page) => !page.slug?.startsWith("collections/"))
    .map((page) => ({
      slug: page.slug?.split("/").filter(Boolean),
    }));
}

async function loadCmsPage(slugSegments?: string[]) {
  const slug = getSlugPath(slugSegments);

  try {
    return await getFullPageBySlugCached(slug);
  } catch (error) {
    if (error instanceof CmsApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

export async function generateMetadata({
  params,
}: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugSegments = slug ?? [];

  try {
    const page = await loadCmsPage(slugSegments);

    if(page.page.metadata){
      return page.page.metadata
    }


    return {
      title: page.page.name,
      description: `CMS page for ${page.page.name}`,
    };
  } catch {
    return {
      title: "CMS content unavailable",
      description: "The CMS content for this page is temporarily unavailable.",
    };
  }
}

export default async function CmsPageRoute({ params }: CmsPageProps) {
  const { slug } = await params;
  const slugSegments = slug ?? [];
  let page;

  try {
    page = await loadCmsPage(slugSegments);
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load CMS page content.", error);

    return (
      <CmsOutageState description="The CMS did not return this page right now. Try refreshing shortly, or revalidate the route after the CMS update finishes." />
    );
  }

  return <CmsPageView page={page} />;
}
