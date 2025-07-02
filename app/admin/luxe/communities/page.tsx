import { Button } from '@/components/ui/button';
import React from 'react';
import AdminLuxeCommunities from "@/features/admin/luxe/community/components/AdminLuxeCommunities";

function AdminLuxeCommunitiesPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <div>
                    <h2 className="text-2xl">Luxe Communities</h2>
                    <p className="text-muted-foreground">Manage luxe-specific content for communities</p>
                </div>
                <nav className="flex items-center space-x-4">
                    <Button className={'py-2'}>
                        Manage Luxe Content
                    </Button>
                </nav>
            </div>

            <AdminLuxeCommunities />
        </div>
    );
}

export default AdminLuxeCommunitiesPage;
