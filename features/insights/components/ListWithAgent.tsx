"use client"
import React from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";

interface ListWithAgentProps {
    agent: AgentType,
}

function ListWithAgent({agent}: ListWithAgentProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Sheet >
            <SheetTrigger className={'border border-slate-200 py-2 text-white px-6 rounded-full'}>
                List with {agent.firstName}
            </SheetTrigger>
            <SheetContent className={'max-w-4xl bg-black text-white p-6'}>
                <SheetHeader >
                    <SheetTitle className={'text-2xl text-white'}>
                        Submit your listings to
                        {agent.firstName}
                    </SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}

export default ListWithAgent;