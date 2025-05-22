import { Button } from '@/components/ui/button';
import React from 'react';
import AdminCommunities from "@/features/admin/community/components/AdminCommunities";

function AdminCommunitiesPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <h2 className="text-2xl ">Communities</h2>
                <nav className="flex items-center space-x-4">
                    <Button  className={'py-2'}>
                        Add Community
                    </Button>
                </nav>
            </div>

            <AdminCommunities />
        </div>
    );
}

export default AdminCommunitiesPage;