import React from 'react';
import SiteFooter from "@/components/site-footer";
import SiteTopNavigation from "@/components/site-top-navigation";

interface LayoutProps {
    children: React.ReactNode
}

function Layout({children}: LayoutProps) {
    return (
        <>
            <SiteTopNavigation />

           <div className="">
               {children}
           </div>


            <SiteFooter/>
        </>
    );
}

export default Layout;