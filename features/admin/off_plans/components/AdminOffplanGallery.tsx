"use client"
import React, { memo, useCallback, useState } from 'react';
import {useGetAdminOffplanGallery} from "@/features/admin/off_plans/api/use-get-admin-offplan-gallery";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FileState, MultiImageDropzone} from "@/components/multi-image-dropzone";
import {useEdgeStore} from "@/db/edgestore";
import {useUploadOffplanImages} from "@/features/admin/off_plans/api/use-upload-offplan-images";

interface AdminOffplanGalleryProps {
    offplanId: string;
}

//gallery form schema array of strings
const GalleryFormSchema = z.object({
    images: z.array(z.string())
})


type formValues = z.infer<typeof GalleryFormSchema>

function AdminOffplanGallery({offplanId}: AdminOffplanGalleryProps) {

    const galleryQuery = useGetAdminOffplanGallery(offplanId)
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const gallery = galleryQuery.data
    const isLoaded = galleryQuery.data && !galleryQuery.isError

    const { edgestore } = useEdgeStore();

    const isLoading = galleryQuery.isLoading
    const [addingImage, setAddingImage] = React.useState(false)

    const uploadImageMutation = useUploadOffplanImages(offplanId)

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

    const form = useForm<{
        images: string[];
    }>({
        mode: "onChange",
        resolver: zodResolver(GalleryFormSchema),
        defaultValues: {
            images: []
        }
    });

    //form submit function
    const onSubmit = (values: formValues) => {
        uploadImageMutation.mutate(values, {
            onSuccess: () => {
                form.reset()
                setAddingImage(false)
            }
        })
    }

    // Memoized callback functions
    const handleToggleAddingImage = useCallback(() => {
        setAddingImage(!addingImage);
    }, [addingImage]);


    return (
        <div className={'flex flex-col gap-6 px-8 '}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gallery</h2>
                <Button size={'sm'} variant={'outline'} onClick={handleToggleAddingImage} >Add Image</Button>
            </div>

            {
                addingImage &&
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'p-6 w-full bg-white rounded-xl space-y-6'}>
                    <div>
                        <MultiImageDropzone

                            value={fileStates}
                            dropzoneOptions={{
                                maxFiles: 20,
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
                                                // @ts-ignore
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

                                     form.setValue('images', [...form.getValues('images'), res.url as string])

                                        } catch (err) {
                                            updateFileProgress(addedFileState.key, 'ERROR');
                                        }
                                    }),
                                );
                            }}
                        />
                    </div>


                    <Button type={'submit'}>Add Image</Button>
                </form>
            }

            <div className="p-6  bg-white rounded-xl grid grid-cols-3 gap-4">

            </div>
        </div>
    );
}

const AdminOffplanGalleryComponent = memo(AdminOffplanGallery);
AdminOffplanGalleryComponent.displayName = 'AdminOffplanGallery';

export default AdminOffplanGalleryComponent;