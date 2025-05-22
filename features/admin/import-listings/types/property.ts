export interface PropertyImage {
    id: string;
    propertyId: string;
    url: string;
    order: number;
}

export interface PropertyData {
    id: string;
    title: string;
    description: string;
    price: number;
    bedrooms: number | string;
    bathrooms: number;
    agentId: string;
    subCommunityId?: string;
    communityId?: string;
    cityId?: string;
    offeringTypeId?: string;
    typeId?: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ImportResponse {
    list: {
        property: PropertyXMLData[];
    };
}

export interface PropertyXMLData {
    title_en: string[];
    description_en: string[];
    price: string[];
    bedroom: string[];
    bathroom: string[];
    community?: string[];
    sub_community?: string[];
    city?: string[];
    offering_type?: string[];
    property_type?: string[];
    private_amenities?: string[];
    agent: AgentXMLData[];
    photo: PhotoXMLData[];
    [key: string]: any;
}

export interface AgentXMLData {
    name: string[];
    email: string[];
    phone: string[];
}

export interface PhotoXMLData {
    url: { _: string; $: { last_updated: string; } }[];
}