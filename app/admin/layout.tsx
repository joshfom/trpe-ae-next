import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {validateRequest} from "@/actions/auth-session";
import {redirect} from "next/navigation";
export const fetchCache = 'force-no-store';
interface AdminLayoutProps {
    children: React.ReactNode;

}
async function AdminLayout({children}: AdminLayoutProps) {

    const {user} = await validateRequest()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className={'flex flex-row h-screen gap-8 bg-gray-100'}>
            <div className="w-1/6 h-screen pl-6 pt-4 bg-slate-900 flex flex-col space-y-6">
                <div className={'flex flex-col pt-6 pl-8 text-white'}>
                    <Link href={'/'}>
                        <Image height={80} width={160} src="/trp-logo.svg" alt=""/>
                    </Link>
                </div>
                <div className={'grow py-6 flex flex-col space-y-4 text-white'}>
                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin'}>
                        Dashboard
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/properties'}>
                        Properties
                    </Link>
                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/property-types'}>
                        Property Types
                    </Link>
                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/off-plans'}>
                        Offplan
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/communities'}>
                        Communities
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/offering-types'}>
                        Offering Types
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/insights'}>
                        Insights
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/page-meta'}>
                        Page Meta
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/languages'}>
                        Languages
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/leads'}>
                        Leads
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/agents'}>
                        Agents
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/amenities'}>
                        Amenities
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/redirects'}>
                        Redirects
                    </Link>

                    <Link className={'py-2 px-4 hover:bg-slate-700 pl-8 rounded-l-xl'} href={'/admin/settings'}>
                        Settings
                    </Link>

                </div>

            </div>
            <div className={'h-screen overflow-y-auto w-5/6 pr-6 py-6'}>
                {children}
            </div>
        </div>
    );
}

export default AdminLayout;