import React from 'react';
import Link from "next/link";

/**
 * SSR-compatible top navigation component
 * Simple menu without dropdowns for better SSR performance
 * Dropdowns require JavaScript so we just show direct links
 */
function TopNavigationSSR() {
    return (
        <div className="hidden lg:flex text-white px-3 relative z-[99999]">
            <nav className="flex space-x-8">
                {/* Sale */}
                <Link href="/properties/for-sale" className="hover:text-slate-300 transition-colors">
                    Sale
                </Link>

                {/* Rent */}
                <Link href="/properties/for-rent" className="hover:text-slate-300 transition-colors">
                    Rent
                </Link>

                {/* Communities */}
                <Link href="/communities" className="hover:text-slate-300 transition-colors">
                    Communities
                </Link>

                {/* New Projects */}
                <Link href="/off-plan" className="hover:text-slate-300 transition-colors">
                    New Projects
                </Link>

                {/* Insights */}
                <Link href="/insights" className="hover:text-slate-300 transition-colors">
                    Insights
                </Link>

                {/* Luxe by TRPE */}
                <Link href="/luxe" className="hover:text-slate-300 transition-colors">
                    Luxe by TRPE
                </Link>
            </nav>
            
            {/* JavaScript Enhancement Notice - Only visible with dev tools */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-full left-0 mt-2 text-xs text-gray-400 opacity-0 hover:opacity-100 transition-opacity">
                    SSR Mode: Dropdowns require JavaScript
                </div>
            )}
        </div>
    );
}

export default TopNavigationSSR;
