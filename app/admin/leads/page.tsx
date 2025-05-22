import React from 'react';
import Link from "next/link";

function LeadPage() {
    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Leads</div>
                </div>

                <div className="items-center  space-x-4">
                    {/*<Link href={'/admin/properties'}>*/}
                    {/*    All Properties*/}
                    {/*</Link>*/}
                </div>
            </div>

            <div>

            </div>

        </div>
    );
}

export default LeadPage;