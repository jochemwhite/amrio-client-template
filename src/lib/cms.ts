import { CmsApiError, requestCmsApi } from "@/lib/api";
import { env } from "@/lib/env";
import type {
  ApiResponse,
  CmsCollectionEntryContent,
  CmsDefaultLayoutsData,
  CmsFullPageData,
  CmsPageContent,
  CmsPageSummary,
} from "@/types/cms";

const CMS_CACHE_REVALIDATE_SECONDS = 3600;
const CMS_CACHE_TAG_BASE = `cms:${env.WEBSITE_ID}`;
const CMS_PAGES_CACHE_TAG = `${CMS_CACHE_TAG_BASE}:pages`;
const CMS_LAYOUT_CACHE_TAG = `${CMS_CACHE_TAG_BASE}:layout`;

function withTagSuffix(suffix: string) {
  return `${CMS_CACHE_TAG_BASE}:${suffix}`;
}

export function getCmsPageCacheTag(slug: string) {
  const normalizedSlug = slug === "/" ? "home" : slug.replace(/^\/+/, "");

  return withTagSuffix(`page:${normalizedSlug}`);
}

export function getCmsCollectionEntryCacheTag(
  prefixSlug: string,
  entrySlug: string,
) {
  return withTagSuffix(`collection:${prefixSlug}:${entrySlug}`);
}

async function requestCms<T>(path: string, tags: string[]) {
  const payload = await requestCmsApi<ApiResponse<T>>(path, {
    revalidate: CMS_CACHE_REVALIDATE_SECONDS,
    tags,
  });

  if (!payload.success) {
    throw new CmsApiError(`CMS request was not successful for "${path}".`, {
      cause: payload,
    });
  }

  return payload.data;
}

function withWebsite(path: string) {
  return `/websites/${env.WEBSITE_ID}${path}`;
}

function withEncodedSlug(slug: string) {
  return encodeURIComponent(slug);
}

export async function getPages() {
  return requestCms<CmsPageSummary[]>(withWebsite("/pages"), [CMS_PAGES_CACHE_TAG]);
}

export async function getPageById(pageId: string) {
  return requestCms<CmsPageContent>(withWebsite(`/pages/${pageId}`), [
    withTagSuffix(`page-id:${pageId}`),
  ]);
}

export async function getPageBySlug(slug: string) {
  return requestCms<CmsPageContent>(
    withWebsite(`/pages/slug/${withEncodedSlug(slug)}`),
    [getCmsPageCacheTag(slug)],
  );
}

export async function getFullPageBySlug(slug: string) {
  return requestCms<CmsFullPageData>(
    withWebsite(`/pages/slug/${withEncodedSlug(slug)}/full`),
    [getCmsPageCacheTag(slug)],
  );
}

export async function getCollectionEntry(prefixSlug: string, entrySlug: string) {
  return requestCms<CmsCollectionEntryContent>(
    withWebsite(`/collections/${prefixSlug}/${entrySlug}`),
    [getCmsCollectionEntryCacheTag(prefixSlug, entrySlug)],
  );
}

export async function getDefaultLayouts() {
  return requestCms<CmsDefaultLayoutsData>(withWebsite("/default-layouts"), [
    CMS_LAYOUT_CACHE_TAG,
  ]);
}

export const getPagesCached = getPages;
export const getPageByIdCached = getPageById;
export const getPageBySlugCached = getPageBySlug;
export const getFullPageBySlugCached = getFullPageBySlug;
export const getCollectionEntryCached = getCollectionEntry;
export const getDefaultLayoutsCached = getDefaultLayouts;

export {
  CMS_CACHE_REVALIDATE_SECONDS,
  CMS_CACHE_TAG_BASE,
  CMS_LAYOUT_CACHE_TAG,
  CMS_PAGES_CACHE_TAG,
};

export { CmsApiError } from "@/lib/api";
