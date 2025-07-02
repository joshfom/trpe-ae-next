type CommunityType = {
    id: string;
    name: string;
    label: string;
    image: string;
    propertyCount: number;
    metaTitle: string;
    metaDesc: string;
    about: string;
    cityId?: string;
    city?: CityType;
    properties?: PropertyType[];
    slug: string;
    createdAt: string;
    featured?: boolean;
    displayOrder?: number;
    // Luxe fields
    isLuxe?: boolean;
    luxeName?: string;
    luxeMetaTitle?: string;
    luxeMetaDesc?: string;
    luxeAbout?: string;
    luxeImageUrl?: string;
    luxeHeroImageUrl?: string;
    luxeFeatured?: boolean;
    luxeDisplayOrder?: number;
}