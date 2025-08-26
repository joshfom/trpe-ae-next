"use client"
import React, {useState} from 'react';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {MultiFileDropzone} from "@/components/ui/multi-file-dropzone";
import {useEdgeStore} from "@/db/edgestore";
import {FileState} from "@/components/ui/multi-file-dropzone";

interface AdminOffplanDetailsProps {
    offplan: any;
}

function AdminOffplanDetails({offplan}: AdminOffplanDetailsProps) {

    const [addingBrochure, setAddingBrochure] = React.useState(false)
    const [addingQrCode, setAddingQrCode] = React.useState(false)

    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const { edgestore } = useEdgeStore();


    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
            const newFileStates = structuredClone(fileStates);
            const fileState = newFileStates.find(
                (fileState) => fileState.key === key,
            );
            if (fileState) {
                fileState.progress = progress;
            }
            return newFileStates;
        });
    }

    return (
        <div className={'flex flex-col px-8 gap-6'}>
            <div className="flex justify-between py-8 px-8">
                <h2 className="text-2xl ">{ offplan.name}</h2>

                <nav className="flex items-center space-x-4">
                    <Button variant={'outline'} className={'py-2'} onClick={() => setAddingBrochure(!addingBrochure)}>
                        {
                            offplan.brochureUrl ? 'Edit Brochure' : 'Add Brochure'
                        }
                    </Button>

                    <Button variant={'outline'} className={'py-2'} onClick={() => setAddingQrCode(!addingQrCode)}>
                        {
                            offplan.qrCode ? 'Edit QR Code' : 'Add QR Code'
                        }
                    </Button>


                    <Button variant={'outline'} className={'py-2'} onClick={() => setAddingQrCode(!addingQrCode)}>
                        Edit Off-plan
                    </Button>

                </nav>
            </div>

            {
                addingBrochure && (
                    <MultiFileDropzone
                        value={fileStates}
                        dropzoneOptions={{
                            maxFiles: 1
                        }}
                        onChange={(files) => {
                            setFileStates(files);
                        }}
                        onFilesAdded={async (addedFiles) => {
                            setFileStates([...fileStates, ...addedFiles]);
                            await Promise.all(
                                addedFiles.map(async (addedFileState) => {
                                    try {
                                        const res = await edgestore.publicFiles.upload({
                                            file: addedFileState.file,
                                            onProgressChange: async (progress) => {
                                                updateFileProgress(addedFileState.key, progress);
                                                if (progress === 100) {
                                                    // wait 1 second to set it to complete
                                                    // so that the user can see the progress bar at 100%
                                                    await new Promise((resolve) => setTimeout(resolve, 1000));
                                                    updateFileProgress(addedFileState.key, 'COMPLETE');
                                                }
                                            },
                                        });
                                        console.log(res);
                                    } catch (err) {
                                        updateFileProgress(addedFileState.key, 'ERROR');
                                    }
                                }),
                            );
                        }}
                    />
                )
            }

            <div className="bg-white p-6 rounded-lg grid grid-cols-6 gap-4">
                <div>
                    Starting price : {offplan.fromPrice}
                </div>
                <div>
                    Max price : {offplan.toPrice}
                </div>

                <div>
                    From size : {offplan.fromSize / 100}
                </div>

                <div>
                    To size : {offplan.toSize / 100}
                </div>

                {
                    offplan.floors && (
                        <div>
                            Floors : {offplan.floors}
                        </div>
                    )
                }

                {
                    offplan.buildYear && (
                        <div>
                            Build year : {offplan.buildYear}
                        </div>
                    )
                }

                {
                    offplan.community && (
                        <div>
                            Community : {offplan.community.name}
                        </div>
                    )
                }

                {
                    offplan.developer && (
                        <div>
                            Developer : {offplan.developer.name}
                        </div>
                    )

                }

                {
                    offplan.qrCode && (
                        <div>
                            <img className={'h-16 w-16'} src={offplan.qrCode} alt="QR code for off-plan property"/>
                        </div>
                    )
                }

            </div>


            <div className="bg-white p-6 rounded-lg">
                <div className={'max-h-96 overflow-auto'}>
                    <div className={'max-h-96 overflow-auto'} dangerouslySetInnerHTML={{__html: offplan.about}}>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default AdminOffplanDetails;