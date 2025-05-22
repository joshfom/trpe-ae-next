"use client"
import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import UploadPropertyData from "@/features/crm/property-owners/components/UploadPropertyData";
import {Upload} from "lucide-react";

enum VARIANT {
    LIST = 'list',
    IMPORT = 'import'
}

const INITIAL_IMPORT_RESULT = {
    data: [],
    errors: [],
    meta: {}
}

function DataPage() {
    const [openUploadSheet, setOpenUploadSheet] = useState(false)

    const handleCloseUploadSheet = () => {
        setOpenUploadSheet(false)
    }

    return (
        <div>
            <div className={'py-6 '}>
                <div className="flex justify-between">
                    <h1 className={'text-xl font-semibold'}>
                        Property Owners
                    </h1>

                    <UploadPropertyData  />
                </div>
            </div>

            <div className="py-12">
                Data Table
            </div>

        </div>
    );
}

export default DataPage;