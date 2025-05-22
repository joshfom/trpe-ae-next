"use client"
import React from 'react';
import {useCSVReader} from "react-papaparse";
import {Button} from "@/components/ui/button";
import {Upload} from "lucide-react";

type UploadDataButtonProps = {
    onUpload: () => void;
}

function UploadDataButton({onUpload}: UploadDataButtonProps) {
   const {CSVReader} = useCSVReader()

    return (
        <CSVReader>
            {({getRootProps} : any) => (
                <Button {...getRootProps()}
                >
                    <Upload size={18} className={'mr-2'}/>
                    Import Data
                </Button>
            )}
        </CSVReader>
    );
}

export default UploadDataButton;