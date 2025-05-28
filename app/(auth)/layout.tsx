import React from 'react';
import {validateRequest} from "@/actions/auth-session";
import {redirect} from "next/navigation";
import SiteTopNavigation from "@/components/site-top-navigation";
import FooterMenuSection from "@/features/site/components/FooterMenuSection";
import SiteFooter from "@/components/site-footer";
import { getFooterCommunities } from '@/actions/get-footer-communities-action';

// Force dynamic rendering for auth routes since they check authentication status
export const dynamic = 'force-dynamic';

async function GuestLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {


    const {user } = await validateRequest()

    if (user) {
        return redirect('/admin')
    }

    // Fetch footer communities for SSR
    const footerCommunities = await getFooterCommunities();

    return (
        <div>

            <SiteTopNavigation/>

            <div className="">
                <div className="hidden lg:block h-20 bg-black">

                </div>
                {children}
            </div>

            <FooterMenuSection/>

            <SiteFooter communities={footerCommunities}/>
        </div>
    );
}

export default GuestLayout;