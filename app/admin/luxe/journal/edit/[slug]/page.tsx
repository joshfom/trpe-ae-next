import React from 'react';
import Link from "next/link";
import LuxeJournalForm from "@/features/admin/luxe/journal/components/LuxeJournalForm";

interface EditLuxeJournalPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function EditLuxeJournalPage({ params }: EditLuxeJournalPageProps) {
    const { slug } = await params;
    
    return (
        <div>
            <div className="flex justify-between items-center h-16 w-full px-4 bg-white">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Edit Luxe Journal Entry</div>
                </div>

                <div className="items-center space-x-4">
                    <Link
                        href={'/admin/luxe/journal'}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                        Back to Journal
                    </Link>
                </div>
            </div>

            <div>
                <LuxeJournalForm journalSlug={slug} />
            </div>
        </div>
    );
}

export default EditLuxeJournalPage;
