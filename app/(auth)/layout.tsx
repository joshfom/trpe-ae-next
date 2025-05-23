import React from 'react';
import {validateRequest} from "@/actions/auth-session";
import {redirect} from "next/navigation";
import SiteTopNavigation from "@/components/site-top-navigation";
import FooterMenuSection from "@/features/site/components/FooterMenuSection";
import SiteFooter from "@/components/site-footer";

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

            <SiteTopNavigation/>

            <div className="">
                <div className="hidden lg:block h-20 bg-black">

                </div>
                {children}
            </div>

            <FooterMenuSection/>

            <SiteFooter/>
        </div>
    );
}

export default GuestLayout;