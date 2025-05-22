type ProjectType = {
    id: string;
    name: string;
    about: string;
    slug: string;
    completionStatus: string;
    developerId: string;
    developer: DeveloperType;
    communityId: string;
    community: CommunityType;
    cityId: string;
    type:UnitType;
    city: CityType;
    images: {
        id: string;
        url: string;
    }[];

    longitude: string;
    latitude: string;
    fromPrice: number;
    toPrice: number;
    paymentTitle: string;
    fromSize: number;
    toSize: number;
    brochureUrl: string;
    floors: number;
    permitNumber: string;
    plotSize: number;
    handoverDate: string;
    referenceNumber: string;
    subCommunity: SubCommunityType;
    serviceCharge: number;
    updatedAt: string;
    createdAt: string;
}