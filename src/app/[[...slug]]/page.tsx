import type { Metadata } from "next";
import { notFound } from "next/navigation";

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

// export const revalidate = 60;
// export const dynamicParams = true;

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
  const page = await loadCmsPage(slugSegments);

  return {
    title: page.page.name,
    description: `CMS page for ${page.page.name}`,
  };
}

export default async function CmsPageRoute({ params }: CmsPageProps) {
  const { slug } = await params;
  const slugSegments = slug ?? [];
  const page = await loadCmsPage(slugSegments);

  return <CmsPageView page={page} />;
}
