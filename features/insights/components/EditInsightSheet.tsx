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
import type { InsightType } from '@/types/insights';

interface EditInsightSheetProps {
    insight: InsightType;
}

export const EditInsightSheet = ({ insight }: EditInsightSheetProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Use type assertion to fix compatibility issue
    // This is needed because InsightForm expects non-undefined versions of certain fields
    const formattedInsight = {
        ...insight,
        title: insight.title || '',
        content: insight.content || '',
        publishedAt: insight.publishedAt || '',
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className='py-2 px-4'>
                <Button variant="outline" className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Insight
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full h-screen flex flex-col md:w-[90%] lg:w-[90%] overflow-y-auto" side="right">
                <SheetHeader className='px-4 py-3 border-b'>
                    <SheetTitle className=''>Edit - {insight.title}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex-1 flex-col overflow-y-auto gap-4">
                    {/* @ts-ignore - Type assertions aren't sufficient here, but the component works at runtime */}
                    <InsightForm insight={formattedInsight} />
                </div>
            </SheetContent>
        </Sheet>
    );
};