import { Metadata } from "next";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type CmsPageSummary = {
  id: string;
  slug: string;
  name: string;
  status: string;
  metadata: Metadata
};

export type CmsContentField = {
  id: string;
  type: string;
  content: unknown;
  order: number | null;
  field_key: string | null;
};

export type CmsContentSection = {
  id: string;
  name: string;
  type: string;
  order: number | null;
  fields: CmsContentField[];
};

export type CmsLayoutData = {
  entries?: CmsLayoutEntry[];
  overrides: unknown[];
};

export type CmsFullPageSection = CmsContentSection & {
  collectionEntry?: unknown | null;
  collection?: unknown | null;
};

export type CmsLayoutEntry = {
  id: string;
  name: string;
  sections: CmsContentSection[];
};

export type CmsPageContent = {
  page: CmsPageSummary;
  sections: CmsContentSection[];
};

export type CmsFullPageData = {
  page: CmsPageSummary;
  sections: CmsFullPageSection[];
  layout: CmsLayoutData;
};

export type CmsDefaultLayoutsData = {
  layout: CmsLayoutData;
};

export type CmsCollectionEntry = {
  id: string;
  collection_id: string;
  created_at: string;
  name: string | null;
  slug: string | null;
};

export type CmsCollectionEntryContent = {
  entry: CmsCollectionEntry;
  sections: CmsContentSection[];
};
