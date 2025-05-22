import { useSearchParams } from "next/navigation";
                    import { useInfiniteQuery } from "@tanstack/react-query";
                    import { db } from "@/db/drizzle";
                    import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
                    import { offplanTable } from "@/db/schema/offplan-table";
                    import { offplanImagesTable } from "@/db/schema/offplan-images-table";
                    import { developerTable } from "@/db/schema/developer-table";
                    import { communityTable } from "@/db/schema/community-table";

                    export const useSearchPropertiesWithDrizzle = (offeringType: string, page?: number) => {
                        const params = useSearchParams();

                        const q = params.get('q') || undefined;
                        const maxPrice = params.get('maxPrice') || undefined;
                        const minPrice = params.get('minPrice') || undefined;
                        const areas = params.get('areas') || undefined;
                        const bed = params.get('bed') || undefined;
                        const bathrooms = params.get('bathrooms') || undefined;
                        const minArea = params.get('minArea') || undefined;
                        const maxArea = params.get('maxArea') || undefined;
                        const sortBy = params.get('sortBy') || undefined;

                        return useInfiniteQuery({
                            enabled: !!offeringType,
                            queryKey: ["offplans", { offeringType, areas, q, maxPrice, minPrice, bed, bathrooms, minArea, maxArea, sortBy }],
                            queryFn: async ({ pageParam = 1 }) => {
                                const limit = 12;
                                const offset = (pageParam - 1) * limit;

                                const conditions = [];

                                if (q) {
                                    conditions.push(or(ilike(offplanTable.name, `%${q}%`), ilike(offplanTable.about, `%${q}%`)));
                                }

                                if (minPrice) {
                                    conditions.push(gte(offplanTable.fromPrice, parseInt(minPrice)));
                                }
                                if (maxPrice) {
                                    conditions.push(lte(offplanTable.toPrice, parseInt(maxPrice)));
                                }

                                if (minArea) {
                                    conditions.push(gte(offplanTable.fromSize, parseInt(minArea)));
                                }
                                if (maxArea) {
                                    conditions.push(lte(offplanTable.toSize, parseInt(maxArea)));
                                }

                                if (areas) {
                                    const areasList = areas.split(',');
                                    if (areasList.length > 0) {
                                        conditions.push(inArray(sql`${communityTable.slug}`, areasList.filter((area): area is string => area !== null)));
                                    }
                                }

                                let orderBy = desc(offplanTable.createdAt);
                                if (sortBy === 'price-asc') {
                                    orderBy = asc(offplanTable.fromPrice);
                                } else if (sortBy === 'price-desc') {
                                    orderBy = desc(offplanTable.fromPrice);
                                } else if (sortBy === 'newest') {
                                    orderBy = desc(offplanTable.createdAt);
                                }

                                const offplansData = await db
                                    .select({
                                        id: offplanTable.id,
                                        name: offplanTable.name,
                                        about: offplanTable.about,
                                        slug: offplanTable.slug,
                                        fromPrice: offplanTable.fromPrice,
                                        toPrice: offplanTable.toPrice,
                                        fromSize: offplanTable.fromSize,
                                        toSize: offplanTable.toSize,
                                        handoverDate: offplanTable.handoverDate,
                                        communityId: offplanTable.communityId,
                                        developerId: offplanTable.developerId,
                                    })
                                    .from(offplanTable)
                                    .leftJoin(communityTable, eq(offplanTable.communityId, communityTable.id))
                                    .leftJoin(developerTable, eq(offplanTable.developerId, developerTable.id))
                                    .where(and(...conditions))
                                    .orderBy(orderBy)
                                    .limit(limit)
                                    .offset(offset);

                                const countResult = await db
                                    .select({ count: sql`count(*)` })
                                    .from(offplanTable)
                                    .leftJoin(communityTable, eq(offplanTable.communityId, communityTable.id))
                                    .leftJoin(developerTable, eq(offplanTable.developerId, developerTable.id))
                                    .where(and(...conditions));

                                const totalCount = Number(countResult[0]?.count || 0);

                                const offplanIds = offplansData.map(offplan => offplan.id);

                                const imagesData = await db
                                    .select({
                                        id: offplanImagesTable.id,
                                        offplanId: offplanImagesTable.offplanId,
                                        url: offplanImagesTable.url,
                                        order: offplanImagesTable.order,
                                    })
                                    .from(offplanImagesTable)
                                    .where(inArray(offplanImagesTable.offplanId, offplanIds))
                                    .orderBy(asc(offplanImagesTable.order));

                                const communitiesData = await db
                                    .select({
                                        id: communityTable.id,
                                        name: communityTable.name,
                                        slug: communityTable.slug,
                                    })
                                    .from(communityTable)
                                    .where(inArray(communityTable.id, offplansData.map(p => p.communityId).filter((id): id is string => id !== null)));

                                const developersData = await db
                                    .select({
                                        id: developerTable.id,
                                        name: developerTable.name,
                                        slug: developerTable.slug,
                                    })
                                    .from(developerTable)
                                    .where(inArray(developerTable.id, offplansData.map(p => p.developerId).filter((id): id is string => id !== null)));

                                const facets: Record<string, number> = {};
                                const facetsResult = await db
                                    .select({
                                        type: sql`count(*)`,
                                        slug: developerTable.slug,
                                    })
                                    .from(offplanTable)
                                    .leftJoin(developerTable, eq(offplanTable.developerId, developerTable.id))
                                    .groupBy(developerTable.slug);

                                facetsResult.forEach(item => {
                                    if (item.slug) {
                                        facets[item.slug] = Number(item.type);
                                    }
                                });

                                const data = offplansData.map(offplan => {
                                    const images = imagesData.filter(img => img.offplanId === offplan.id);
                                    const community = communitiesData.find(c => c.id === offplan.communityId) || { name: '', slug: '' };
                                    const developer = developersData.find(d => d.id === offplan.developerId) || { name: '', slug: '' };

                                    return {
                                        ...offplan,
                                        images,
                                        community,
                                        developer,
                                    };
                                });

                                return {
                                    data,
                                    facets,
                                    totalCount,
                                    nextPage: pageParam + 1,
                                    hasMore: offset + data.length < totalCount,
                                };
                            },
                            initialPageParam: 1,
                            getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
                        });
                    };