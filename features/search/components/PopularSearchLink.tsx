'use client';

import Link from "next/link";
import { pushToDataLayer } from '@/lib/gtm';
import { ReactNode } from 'react';

interface PopularSearchLinkProps {
    href: string;
    className?: string;
    children: ReactNode;
    searchTerm: string;
}

export default function PopularSearchLink({ href, className, children, searchTerm }: PopularSearchLinkProps) {
    const handleClick = () => {
        pushToDataLayer({
            event: 'popular_search_clicked',
            search_term: searchTerm,
            destination_url: href,
            page_location: 'homepage',
            component: 'server_search',
            timestamp: new Date().toISOString()
        });
    };

    return (
        <Link 
            href={href}
            className={className}
            onClick={handleClick}
        >
            {children}
        </Link>
    );
}
