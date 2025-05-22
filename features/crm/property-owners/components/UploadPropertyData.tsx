"use client"
import React, {useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useCSVReader} from "react-papaparse";
import {Button} from "@/components/ui/button";
import {Upload} from "lucide-react";
import {ImportTable} from "@/features/crm/property-owners/components/ImportTable";
import {propertyOwnersTable} from "@/db/schema/property-owners-table";
import {useBulkCreatePropertyOwner} from "@/features/crm/property-owners/api/use-bulk-create-property-owners";
import {PropertyOwnerFormSchema} from "@/lib/types/form-schema/property-owners-form-schema";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
};


const requiredOptions = [
    "name",
    "procedure_number",
    "unit_number",
    "size",
    "phone",
    "building_name",
];

interface SelectedColumnsState {
    [key: string]: string | null;
};

function UploadPropertyData() {
    const {CSVReader} = useCSVReader()
    const [isOpen, setIsOpen] = React.useState(false)
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    // const createPropertyOwnerMutation =

    const onCancel = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setIsOpen(false);
    };

    const handleUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setIsOpen(true)
    }

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

    const headers : any[] = importResults.data[0];
    const body : any[][] = importResults.data;
    const bulkCreate = useBulkCreatePropertyOwner()
    const [progress, setProgress] = React.useState(0);

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = {...prev};

            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    };


        useEffect(() => {

            // Calculate progress based on how many required options are in selectedColumns
            const calculateProgress = () => {
                let count = 0;
                requiredOptions.forEach(option => {
                    if (Object.values(selectedColumns).includes(option)) {
                        count++;
                    }
                });
                return count;
            };

            setProgress(calculateProgress());
        }, [selectedColumns]);

    // const progress = Object.values(selectedColumns).filter(Boolean).length;

    const onSubmitImport = async (
        values: typeof PropertyOwnerFormSchema[],
    ) => {

        const data = values.map((value) => ({
            ...value,
        }));

        // @ts-ignore
        bulkCreate.mutate(data, {
            onSuccess: () => {
                onCancel();
            },
        });
    };

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        };

        const mappedData = {
            headers: headers?.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                });

                return transformedRow.every((item) => item === null)
                    ? []
                    : transformedRow;
            }).filter((row) => row.length > 0),
        };

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    acc[header] = cell;
                }

                return acc;
            }, {});
        });

        const formattedData = arrayOfData.map((item) => ({
            ...item,
        }));

        console.log('formatted data', formattedData.slice(1));
        onSubmitImport(formattedData.slice(1));

    };

    return (
       <>
           <CSVReader
               onUploadAccepted={handleUpload}
           >
               {({getRootProps} : any) => (
                   <Button {...getRootProps()}
                   >
                       <Upload size={18} className={'mr-2'}/>
                       Import Data
                   </Button>
               )}
           </CSVReader>
           <Sheet
           open={isOpen}
           onOpenChange={setIsOpen}
       >
               <SheetContent className={'w-[95%]'}>
                   <div className={'flex pb-4 justify-between'}>
                       <div>
                           <SheetTitle>Upload Excel data</SheetTitle>
                           <p className="text-sm">
                               Upload Excel data...
                           </p>
                       </div>

                       <div className="flex gap-y-2 items-center gap-x-4">
                           <Button
                               onClick={onCancel}
                               type={'button'}
                               size="sm"
                               className="w-full lg:w-auto"
                           >
                               Cancel
                           </Button>
                           <Button
                               size="sm"
                               disabled={progress < requiredOptions.length}
                               onClick={handleContinue}
                               className="w-full lg:w-auto"
                           >
                               Continue ({progress} / {requiredOptions.length})
                           </Button>
                       </div>
                   </div>

                   <div className="border-none drop-shadow-xs">

                       <div>
                           <ImportTable
                               headers={headers}
                               body={body}
                               selectedColumns={selectedColumns}
                               onTableHeadSelectChange={onTableHeadSelectChange}
                           />
                       </div>
                   </div>
               </SheetContent>
           </Sheet>
       </>

    );
}

export default UploadPropertyData;