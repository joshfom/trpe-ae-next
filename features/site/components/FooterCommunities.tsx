import React from "react";
import Link from "next/link";
import {getFooterCommunities} from "@/actions/get-footer-communities-action";

export default async function FooterCommunities() {
    // Use the dedicated server action with strong caching
    const communities = await getFooterCommunities();
    
    if (!communities || communities.length === 0) {
        return null;
    }
    
    return (
        <div className="pt-2 flex text-sm flex-col">
            {communities.map((community) => (
                <Link
                    className={
                        "px-4 py-2 border-b border-transparent hover:bg-zinc-900 text-slate-300 hover:text-white hover:border-white"
                    }
                    key={community.slug}
                    href={`/communities/${community.slug}`}
                >
                    {community.name}
                </Link>
            ))}
        </div>
    );
}