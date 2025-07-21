import React from 'react';
import { Button } from '@/components/ui/button';
import AdminLuxeProperties from "@/features/admin/luxe/properties/components/AdminLuxeProperties";
import Link from 'next/link';
import { Plus } from 'lucide-react';

async function AdminLuxePropertiesPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between py-8 px-8">
                <div>
                    <h2 className="text-2xl">Luxe Properties</h2>
                    <p className="text-muted-foreground">Manage luxe property listings and content</p>
                </div>
                <nav className="flex items-center space-x-4">
                    <Link href="/admin/luxe/properties/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add New Property
                        </Button>
                    </Link>
                </nav>
            </div>

            <AdminLuxeProperties />
        </div>
    );
}

export default AdminLuxePropertiesPage;
