import React from 'react';
import AdminPropertyTypes from "@/features/admin/property-types/components/AdminPropertyTypes";

function AdminPropertyTypesPage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <h2 className="text-2xl ">Property Types</h2>
            </div>

            <AdminPropertyTypes />
        </div>
    );
}

export default AdminPropertyTypesPage;
