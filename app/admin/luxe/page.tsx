import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, Home, Crown } from 'lucide-react';

function AdminLuxePage() {
    const luxeEntities = [
        {
            title: "Communities",
            description: "Manage luxe community content and settings",
            href: "/admin/luxe/communities",
            icon: Building2,
            count: "Enable luxe features for premium communities"
        },
        {
            title: "Advisors",
            description: "Manage luxe advisor profiles and content",
            href: "/admin/luxe/advisors",
            icon: Users,
            count: "Premium real estate advisors"
        },
        {
            title: "Journal",
            description: "Manage luxe insights and journal articles",
            href: "/admin/luxe/journal",
            icon: FileText,
            count: "Exclusive insights and articles"
        },
        {
            title: "Properties",
            description: "Manage luxe property listings and content",
            href: "/admin/luxe/properties",
            icon: Home,
            count: "Premium property listings"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="py-8 px-8">
                <div className="flex items-center gap-3 mb-4">
                    <Crown className="h-8 w-8 text-yellow-600" />
                    <h1 className="text-3xl font-bold">Luxe Administration</h1>
                </div>
                <p className="text-muted-foreground">
                    Manage premium content and features for the Luxe by TRPE section
                </p>
            </div>

            {/* Grid of Luxe Entities */}
            <div className="px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {luxeEntities.map((entity) => {
                        const IconComponent = entity.icon;
                        return (
                            <Link key={entity.title} href={entity.href}>
                                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-yellow-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                                                <IconComponent className="h-6 w-6 text-yellow-600" />
                                            </div>
                                            <Crown className="h-4 w-4 text-yellow-400" />
                                        </div>
                                        <CardTitle className="text-lg group-hover:text-yellow-700 transition-colors">
                                            {entity.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm mb-3">
                                            {entity.description}
                                        </CardDescription>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            {entity.count}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Quick Stats Section */}
            <div className="px-8">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        Luxe Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-700">0</div>
                            <div className="text-sm text-muted-foreground">Luxe Communities</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-700">0</div>
                            <div className="text-sm text-muted-foreground">Luxe Advisors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-700">0</div>
                            <div className="text-sm text-muted-foreground">Journal Articles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-700">0</div>
                            <div className="text-sm text-muted-foreground">Luxe Properties</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLuxePage;
