/**
 * Centralized definition of InsightType to be used across the application
 * This helps avoid type mismatches between different parts of the application
 */
export interface InsightType {
    id: string;
    title?: string;
    coverUrl?: string;
    authorId?: string;
    aboutAuthor?: string;
    communityId?: string;
    subCommunityId?: string;
    altText?: string;
    metaDescription?: string;
    metaTitle?: string;
    cityId?: string;
    developerId?: string;
    content?: string;
    developmentId?: string;
    isPublished?: string;
    publishedAt?: string;
    agentId?: string;
    slug: string;
    updatedAt?: string;
    createdAt: string;
}
