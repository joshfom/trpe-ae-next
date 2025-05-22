import React from 'react';
import Link from "next/link";
import {ADMIN_BASE_PATH} from "@/lib/constants";

interface SettingsPageProps {
    children: React.ReactNode;
}
function SettingsPage({children}: SettingsPageProps) {
    return (
        <div className={'w-full '}>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Settings</div>
                </div>

                <div className="items-center  space-x-4">

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className={'py-12'}>
                    <nav className={'space-y-3 flex flex-col p-4'}>
                        <Link className={'py-1.5 px-4 bg-slate-50 hover:bg-black hover:text-white'} href={`${ADMIN_BASE_PATH}/settings/cities`}>
                            Cities
                        </Link>

                        <Link className={'py-1.5 px-4 bg-slate-50 hover:bg-black hover:text-white'} href={`${ADMIN_BASE_PATH}/settings/communities`}>
                            Communities
                        </Link>

                        <Link className={'py-1.5 px-4 bg-slate-50 hover:bg-black hover:text-white'} href={`${ADMIN_BASE_PATH}/settings/sub-communities`}>
                            Sub Communities
                        </Link>

                        <Link className={'py-1.5 px-4 bg-slate-50 hover:bg-black hover:text-white'} href={`${ADMIN_BASE_PATH}/settings/property-types`}>
                            Property Types
                        </Link>

                        <Link className={'py-1.5 px-4 bg-slate-50 hover:bg-black hover:text-white'} href={`${ADMIN_BASE_PATH}/settings/amenities`}>
                            Amenities
                        </Link>
                    </nav>
                </div>
                <div className={'col-span-1 lg:col-span-5 bg-red-500'}>
                    {
                        children
                    }
                </div>
            </div>

        </div>
    );
}

export default SettingsPage;