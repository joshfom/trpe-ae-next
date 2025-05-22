"use client"

import React, { useState } from 'react';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import InsightForm from '@/features/admin/insights/components/InsightForm';
import {usePathname} from "next/navigation";
import {PageMetaType} from "@/features/admin/page-meta/types/page-meta-type";
import {PageMetaForm} from "@/features/admin/page-meta/components/page-meta-form";

interface EditPageMetaSheetProps {
    pageMeta?: PageMetaType;
    pathname?: string;
}

export const EditPageMetaSheet = ({ pageMeta, pathname: propPathname }: EditPageMetaSheetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentPathname = usePathname();
    
    // Use the provided pathname or the current pathname from the router
    const pathname = propPathname || currentPathname;
    
    console.log('EditPageMetaSheet pathname:', pathname);
    
    const handleFormSubmitted = () => {
        setIsOpen(false);
    };


    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className='py-2 px-4'>
                <Button variant="outline" className="flex px-6 py-4 items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                   Edit Page Meta
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full h-screen flex flex-col md:w-[90%]  p-6 lg:w-[90%] overflow-y-auto" side="right">
                <SheetHeader className='px-4 py-3 border-b'>
                    <SheetTitle className=''>
                        {
                            pageMeta ? `Edit - ${pageMeta.title}` : 'Create Meta for this page'
                        }
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex-1 flex-col px-4 overflow-y-auto gap-4">
                    <PageMetaForm
                        pathname={pathname}
                        defaultValues={pageMeta}
                        onSubmitted={handleFormSubmitted}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};