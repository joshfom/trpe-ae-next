import React from 'react';
import AgentList from "@/features/agents/components/AgentList";
import type {Metadata} from "next";


export const metadata: Metadata = {
    title: "Meet our team | Dubai Real Estate | Buy, Sell or Rent Property in Dubai",
    description: "Meet our team of experts. Find your next home or investment in Dubai. Browse the latest Dubai property for sale or rent.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL}/our-team`,
    }
};

function AgentPage()
{
    return (
        <div>
            <div className="py-10 bg-black hidden lg:block"></div>
            <div className="py-12  max-w-7xl mx-auto px-4 sm:px-6">
                <div className={'py-6 '}>
                    <h1 className={'text-3xl font-semibold'}>TRPE Experts</h1>
                </div>
                <AgentList />
            </div>
        </div>
    );
}

export default AgentPage;