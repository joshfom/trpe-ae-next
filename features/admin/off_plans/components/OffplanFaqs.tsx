"use client"
import React from 'react';
import { useGetOffplanFaqsV2 } from "@/features/admin/page-meta/api/use-get-offplan-faqs-v2";
import {Button} from "@/components/ui/button";
import AddOffplanFaqForm from "@/features/admin/off_plans/components/AddOffplanFaqForm";

interface OffplanFaqsProps {
    offplanId: string;
}

function OffplanFaqs({offplanId}: OffplanFaqsProps) {

    const faqsQuery = useGetOffplanFaqsV2(offplanId)
    const faqs = faqsQuery.data
    const isLoaded = faqsQuery.data && !faqsQuery.isError
    const isLoading = faqsQuery.isLoading

    const [addingFaq, setAddingFaq] = React.useState(false)


    return (
        <div className={'flex flex-col gap-8 px-8'}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">FAQs</h2>
                <Button size={'sm'} variant={'outline'} onClick={() => setAddingFaq(!addingFaq)} className="">Add FAQ</Button>
            </div>

            {
                addingFaq &&
                <AddOffplanFaqForm offplanId={offplanId} offplanAdded={() => setAddingFaq(false)}/>
            }

            <div className="bg-white p-6 rounded-lg">

            </div>
        </div>
    );
}

export default OffplanFaqs;