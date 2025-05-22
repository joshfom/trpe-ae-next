"use client"
import React, {useEffect, useState} from 'react';
import Link from "next/link";

function CRMDashboardPage() {

    return (
        <div className={'py-6'}>
            <h1 className={'text-2xl'}>CRM Dashboard</h1>

            <div className="grid grid-cols-4 gap-4 py-12">
                <div className={'space-y-2 hover:bg-slate-100 py-4 w-full flex flex-col items-center justify-center'}>
                    <h2 className={'text-2xl font-semibold'}>
                        Insights
                    </h2>

                    <Link href={'/crm/insights'} className={'hover:underline'}>
                        All Insights
                    </Link>

                </div>

                <div className={'space-y-2 hover:bg-slate-100 py-4 w-full flex flex-col items-center justify-center'}>
                    <h2 className={'text-2xl font-semibold'}>
                        Communities
                    </h2>

                    <Link href={'/crm/communities'} className={'hover:underline'}>
                        All communities
                    </Link>

                </div>

                <div className={'space-y-2 hover:bg-slate-100 py-4 w-full flex flex-col items-center justify-center'}>
                    <h2 className={'text-2xl font-semibold'}>
                        Buildings
                    </h2>

                    <Link href={'/crm/insights'} className={'hover:underline'}>
                        All Buildings
                    </Link>

                </div>

                <div className={'space-y-2 hover:bg-slate-100 py-4 w-full flex flex-col items-center justify-center'}>
                    <h2 className={'text-2xl font-semibold'}>
                        New Projects
                    </h2>

                    <Link href={'/crm/new-projects'} className={'hover:underline'}>
                        All new projects
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default CRMDashboardPage;