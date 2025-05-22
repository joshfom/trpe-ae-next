"use client"
import React from 'react';
import {saveXmlListing} from "@/actions/save-xml-listing-action";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

function ImportListing() {

 const runPropertyImport = async () => {
    toast.success('Importing properties')
    try {
        await saveXmlListing(`${process.env.NEXT_PUBLIC_URL}/api/xml`) // replace with your server's base URL
        toast.success('Properties imported successfully')
    } catch (error) {
        toast.error('Failed to import properties')
        console.error(error)
    }
}

    return (
       <Button onClick={() => runPropertyImport()} className="flex items-center bg-accent-foreground text-white px-4 py-2 rounded-lg">
           Import Properties
       </Button>
    );
}

export default ImportListing;