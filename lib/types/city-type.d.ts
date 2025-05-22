type  CityType = {
    id: string,
    name: string,
    country: string,
    communityId: string,
    communities: CommmunityType[],
    properties: PropertyType[],
    subCommunities: SubCommunityType[],
    createdAt: string,
    updatedAt: string
}