"use client"
import React from 'react';
import AuthorForm from "@/features/admin/author/components/AuthorForm";
import {Button} from "@/components/ui/button";

function AdminInsightPage() {

    const [isOpen, setIsOpen] = React.useState(false)



    return (
        <div>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">All Authors</div>
                </div>

                <div className="items-center  space-x-4">
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Add Author
                    </Button>
                </div>
            </div>

            <AuthorForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />



        </div>
    );
}

export default AdminInsightPage;