export interface PageMeta {
  id: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  title: string;
  content: string;
  path: string;
  noIndex?: boolean;
  noFollow?: boolean;
  includeInSitemap?: boolean;
  updatedAt: string | null;
  createdAt: string;
}
