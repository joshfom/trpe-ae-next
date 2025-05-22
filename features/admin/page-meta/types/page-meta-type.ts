export interface PageMetaType {
    id: string;
    title: string;
    metaTitle: string;
    path: string;
    metaDescription: string;
    content: string;
    noIndex?: boolean;
    noFollow?: boolean;
    metaKeywords?: string;
    includeInSitemap?: boolean;
}
