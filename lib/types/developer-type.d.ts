type DeveloperType = {
    id: string;
    name: string;
    about: string;
    featuredImage?: string;
    logoUrl: string;
    properties?: PropertyType[];
    offplans?: PropertyType[];
    slug: string;
    order: number
}