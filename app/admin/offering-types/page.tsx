import React from 'react';
import AdminOfferingTypes from "@/features/admin/offering/components/AdminOfferingTypes";

function AdminOfferingTypePage() {
    return (
        <div className={' space-y-8'}>
            <div className="flex justify-between py-8 px-8">
                <h2 className="text-2xl ">Offering</h2>

            </div>

            <AdminOfferingTypes />
        </div>
    );
}

export default AdminOfferingTypePage;