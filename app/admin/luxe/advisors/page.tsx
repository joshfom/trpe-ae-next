import React from 'react';
import { Button } from '@/components/ui/button';
import AdminLuxeAdvisors from "@/features/admin/luxe/advisors/components/AdminLuxeAdvisors";

function AdminLuxeAdvisorsPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <div>
                    <h2 className="text-2xl">Luxe Advisors</h2>
                    <p className="text-muted-foreground">Manage luxe advisor profiles and content</p>
                </div>
                <nav className="flex items-center space-x-4">
                    <Button className={'py-2'}>
                        Add Luxe Advisor
                    </Button>
                </nav>
            </div>

            <AdminLuxeAdvisors />
        </div>
    );
}

export default AdminLuxeAdvisorsPage;
