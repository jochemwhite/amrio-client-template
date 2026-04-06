import { cache } from "react";

import { api, CmsApiError } from "@/lib/api";
import { env } from "@/lib/env";
import type {
  ApiResponse,
  CmsCollectionEntryContent,
  CmsDefaultLayoutsData,
  CmsFullPageData,
  CmsPageContent,
  CmsPageSummary,
} from "@/types/cms";

async function requestCms<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  const payload = response.data;

  if (!payload.success) {
    throw new CmsApiError(`CMS request was not successful for "${path}".`, {
      status: response.status,
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
  return requestCms<CmsPageSummary[]>(withWebsite("/pages"));
}

export async function getPageById(pageId: string) {
  return requestCms<CmsPageContent>(withWebsite(`/pages/${pageId}`));
}

export async function getPageBySlug(slug: string) {
  return requestCms<CmsPageContent>(
    withWebsite(`/pages/slug/${withEncodedSlug(slug)}`),
  );
}

export async function getFullPageBySlug(slug: string) {
  return requestCms<CmsFullPageData>(
    withWebsite(`/pages/slug/${withEncodedSlug(slug)}/full`),
  );
}

export async function getCollectionEntry(prefixSlug: string, entrySlug: string) {
  return requestCms<CmsCollectionEntryContent>(
    withWebsite(`/collections/${prefixSlug}/${entrySlug}`),
  );
}

export async function getDefaultLayouts() {
  return requestCms<CmsDefaultLayoutsData>(withWebsite("/default-layouts"));
}

export const getPagesCached = cache(getPages);
export const getPageByIdCached = cache(getPageById);
export const getPageBySlugCached = cache(getPageBySlug);
export const getFullPageBySlugCached = cache(getFullPageBySlug);
export const getCollectionEntryCached = cache(getCollectionEntry);
export const getDefaultLayoutsCached = cache(getDefaultLayouts);

export { CmsApiError } from "@/lib/api";
