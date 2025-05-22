"use client"
import React from 'react';
import {useGetOffplanFaqs} from "@/features/admin/off_plans/api/use-get-offplan-faqs";
import {Button} from "@/components/ui/button";
import AddOffplanFaqForm from "@/features/admin/off_plans/components/AddOffplanFaqForm";
import {useGetFaqList} from "@/features/admin/faq/hooks/use-get-faq-list";
import AddFaqForm from "@/features/admin/faq/components/AddFaqForm";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface FaqListProps {
    target: {
        id: string
        name: string
    }
}

function FaqList({target}: FaqListProps) {

    const faqsQuery = useGetFaqList(target.id, target.name)
    const faqs = faqsQuery.data || [] // Provide a default empty array if data is undefined
    const isLoaded = faqsQuery.isFetched && !faqsQuery.isError
    const isLoading = faqsQuery.isLoading

    const [addingFaq, setAddingFaq] = React.useState(false)
    const [editingFaqId, setEditingFaqId] = React.useState<string | null>(null)

    const handleEditClick = (faqId: string) => {
        setEditingFaqId(faqId)
        // Here you would typically open an edit form or modal
        console.log(`Editing FAQ with ID: ${faqId}`)
    }


    return (
        <div className={'flex flex-col gap-8 px-8'}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">FAQs</h2>
                <Button size={'sm'} variant={'outline'} onClick={() => setAddingFaq(!addingFaq)} className="">Add FAQ</Button>
            </div>

            {
                addingFaq &&
                <AddFaqForm
                    targetId={target.id}
                    target={target.name}
                    faqAdded={() => setAddingFaq(false)}
                />
            }

            <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold">FAQs</h3>

                {
                    isLoading && <p>Loading...</p>
                }

                {
                    isLoaded && faqs.length === 0 && <p>No FAQs found</p>
                }

                {
                    isLoaded && faqs.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id}>
                                    <AccordionTrigger className="text-md font-semibold">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="pt-2">
                                            <p className="text-sm">{faq.answer}</p>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleEditClick(faq.id)} 
                                                className="mt-2"
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )
                }
            </div>
        </div>
    );
}

export default FaqList;
