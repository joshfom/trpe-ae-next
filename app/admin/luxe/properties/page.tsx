import React from 'react';
import { Button } from '@/components/ui/button';
import AdminLuxeProperties from "@/features/admin/luxe/properties/components/AdminLuxeProperties";

async function AdminLuxePropertiesPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <div>
                    <h2 className="text-2xl">Luxe Properties</h2>
                    <p className="text-muted-foreground">Manage luxe property listings and content</p>
                </div>
                <nav className="flex items-center space-x-4">
                    <Button className={'py-2'}>
                        Manage Luxe Content
                    </Button>
                </nav>
            </div>

            <AdminLuxeProperties />
        </div>
    );
}

export default AdminLuxePropertiesPage;
