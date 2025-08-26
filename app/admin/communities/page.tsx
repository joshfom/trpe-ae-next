import { Button } from '@/components/ui/button';
import React from 'react';
import AdminCommunities from "@/features/admin/community/components/AdminCommunities";
import Link from 'next/link';
import { Plus } from 'lucide-react';

function AdminCommunitiesPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <h2 className="text-2xl ">Communities</h2>
                <nav className="flex items-center space-x-4">
                    <Link href="/admin/communities/new">
                        <Button className={'py-2 flex items-center gap-2'}>
                            <Plus size={16} />
                            Add Community
                        </Button>
                    </Link>
                </nav>
            </div>

            <AdminCommunities />
        </div>
    );
}

export default AdminCommunitiesPage;