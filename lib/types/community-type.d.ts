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
}