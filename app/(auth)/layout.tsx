import React from 'react';
import {validateRequest} from "@/actions/auth-session";
import {redirect} from "next/navigation";
import SiteTopNavigationSSR from "@/components/site-top-navigation-ssr";
import FooterMenuSection from "@/features/site/components/FooterMenuSection";
import SiteFooterWrapper from "@/components/SiteFooterWrapper";

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

    return (
        <div>

            <SiteTopNavigationSSR/>

            <div className="">
                <div className="hidden lg:block h-20 bg-black">

                </div>
                {children}
            </div>

            <FooterMenuSection/>

            <SiteFooterWrapper/>
        </div>
    );
}

export default GuestLayout;