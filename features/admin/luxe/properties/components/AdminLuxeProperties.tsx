import React from 'react';
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { propertyTable } from "@/db/schema/property-table";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Eye, EyeOff, Edit } from 'lucide-react';
import { PropertyType } from "@/types/property";
import { Button } from '@/components/ui/button';

async function AdminLuxeProperties() {
    // Fetch only luxe properties from the database
    const luxeProperties = await db.query.propertyTable.findMany({
        where: eq(propertyTable.isLuxe, true),
        with: {
            community: true,
            subCommunity: true,
            agent: true,
            city: true,
            offeringType: true,
            images: true,
        },
        orderBy: (properties, { desc }) => [desc(properties.createdAt)],
        limit: 24,
    }) as unknown as PropertyType[];

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-yellow-600" />
                        <CardTitle>Luxe Properties Management</CardTitle>
                    </div>
                    <CardDescription>
                        Manage and view all luxury properties marked as "Luxe" in the system.
                        {luxeProperties.length > 0 && (
                            <span className="ml-2 text-sm font-medium">
                                {luxeProperties.length} luxe {luxeProperties.length === 1 ? 'property' : 'properties'} found
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {luxeProperties.length === 0 ? (
                        <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No luxe properties found</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Properties need to be marked as "isLuxe: true" to appear here
                                </p>
                                <Link href="/admin/properties" className="inline-block mt-4">
                                    <Button variant="outline" size="sm">
                                        Go to Properties to Mark as Luxe
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {luxeProperties.map((property: any) => (
                                <div 
                                    key={property.id} 
                                    className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow relative"
                                >
                                    {/* Luxe Badge */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <Crown size={12} />
                                            Luxe
                                        </div>
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <div className="relative">
                                            {property.images?.[0]?.s3Url ? (
                                                <img
                                                    height={200}
                                                    width={400}
                                                    className="rounded-t-lg h-48 w-full object-cover"
                                                    src={property.images[0].s3Url}
                                                    alt={property.title || property.name || "Property image"}
                                                />
                                            ) : (
                                                <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                                                    <span className="text-gray-400">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                                                {property.title || property.name || 'Untitled Property'}
                                            </h3>
                                            
                                            <div className="text-xs text-gray-500 mb-2">
                                                {property.community?.name || property.city?.name || 'Location not specified'}
                                            </div>
                                            
                                            {property.price && (
                                                <div className="text-sm font-medium text-green-600 mb-2">
                                                    AED {Number(property.price).toLocaleString()}
                                                </div>
                                            )}
                                            
                                            <div className="text-xs text-gray-500 mb-3">
                                                {property.bedrooms ? `${property.bedrooms} bed` : ''} 
                                                {property.bedrooms && property.bathrooms ? ' • ' : ''}
                                                {property.bathrooms ? `${property.bathrooms} bath` : ''}
                                                {property.size ? ` • ${Math.round(property.size / 100)} sqft` : ''}
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2">
                                                    {property.status === 'published' ? (
                                                        <Eye size={14} className="text-green-500" />
                                                    ) : (
                                                        <EyeOff size={14} className="text-gray-400" />
                                                    )}
                                                    <span className="text-xs text-gray-500">
                                                        {property.status || 'draft'}
                                                    </span>
                                                </div>
                                                
                                                <Link href={`/admin/luxe/properties/edit/${property.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Edit property">
                                                        <Edit size={14} />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminLuxeProperties;
