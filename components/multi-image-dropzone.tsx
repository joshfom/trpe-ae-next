'use client';

import { formatFileSize } from '@edgestore/react/utils';
import { Camera, ImageUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { convertMultipleImagesToWebP } from '@/lib/image-utils';
import { SortableImageGrid } from "@/components/ui/sortable-image-grid";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    EnhancedFileState,
    markImageForDeletion,
    removeImage,
    addImages,
    getVisibleImages,
    validateImageCollection,
    validateImageOperationRealTime,
    createImageErrorMessage,
    reorderImages
} from '@/lib/image-management-utils';
import { useImageValidation } from '@/hooks/use-image-validation';
import { toast } from 'sonner';

const variants = {
    base: 'relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[200px] w-full border-2 border-dashed border-gray-300 dark:border-gray-600 transition-colors duration-200 ease-in-out hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-900',
    image:
        'border-0 p-0 w-full h-full relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md',
    active: 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    disabled:
        'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
    accept: 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    reject: 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20',
};

// Re-export the enhanced FileState for backward compatibility
export type FileState = EnhancedFileState;

type InputProps = {
    className?: string;
    value?: FileState[];
    onChange?: (files: FileState[]) => void | Promise<void>;
    onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
    onImageDelete?: (index: number) => void | Promise<void>;
    onImageReorder?: (fromIndex: number, toIndex: number) => void | Promise<void>;
    disabled?: boolean;
    dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
    allowDelete?: boolean;
    allowReorder?: boolean;
    showDeleteConfirmation?: boolean;
    minImages?: number;
    maxImages?: number;
};

const ERROR_MESSAGES = {
    fileTooLarge(maxSize: number) {
        return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
    },
    fileInvalidType() {
        return 'Invalid file type.';
    },
    tooManyFiles(maxFiles: number) {
        return `You can only add ${maxFiles} file(s).`;
    },
    fileNotSupported() {
        return 'The file is not supported.';
    },
};

const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            dropzoneOptions,
            value,
            className,
            disabled,
            onChange,
            onFilesAdded,
            onImageDelete,
            onImageReorder,
            allowDelete = true,
            allowReorder = true,
            showDeleteConfirmation = true,
            minImages = 6,
            maxImages = 40
        },
        ref,
    ) => {
        const [customError, setCustomError] = React.useState<string>();
        const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
        const [isProcessing, setIsProcessing] = React.useState(false);
        const [operationStatus, setOperationStatus] = React.useState<{
            type: 'upload' | 'delete' | 'reorder' | null;
            message: string;
        }>({ type: null, message: '' });

        // Get only visible (non-deleted) images for display
        const visibleImages = React.useMemo(() => {
            return value ? getVisibleImages(value) : [];
        }, [value]);

        // Use comprehensive validation hook
        const imageValidation = useImageValidation(value || [], {
            minImages,
            maxImages,
            enableRealTimeValidation: true
        });



        // Handle image deletion
        const handleImageDelete = React.useCallback(async (index: number) => {
            if (!value || index < 0 || index >= visibleImages.length) return;

            // Find the actual index in the original array
            const imageToDelete = visibleImages[index];
            const actualIndex = value.findIndex(img => img.key === imageToDelete.key);

            if (actualIndex === -1) return;

            setIsProcessing(true);
            setOperationStatus({ type: 'delete', message: 'Deleting image...' });

            try {
                const imageState = value[actualIndex];
                let result;

                if (imageState.isExisting) {
                    // For existing images, mark for deletion (soft delete)
                    result = markImageForDeletion(value, actualIndex);
                    if (result.success && result.updatedImages) {
                        await onChange?.(result.updatedImages);
                        await onImageDelete?.(actualIndex);
                        toast.success('Image marked for deletion');
                    }
                } else {
                    // For new images, remove completely (hard delete)
                    result = removeImage(value, actualIndex);
                    if (result.success && result.updatedImages) {
                        await onChange?.(result.updatedImages);
                        await onImageDelete?.(actualIndex);
                        toast.success('Image removed');
                    }
                }

                // Validate deletion operation in real-time
                const updatedImages = result?.updatedImages || value;
                const deleteValidation = validateImageOperationRealTime(
                    updatedImages,
                    'delete',
                    minImages,
                    maxImages
                );

                if (!deleteValidation.isValid) {
                    setCustomError(deleteValidation.errors[0]);
                    toast.warning(deleteValidation.errors[0]);
                } else if (deleteValidation.warnings.length > 0) {
                    setCustomError(deleteValidation.warnings[0]);
                    toast.warning(deleteValidation.warnings[0]);
                } else {
                    setCustomError(undefined);
                }

            } catch (error) {
                const errorMessage = createImageErrorMessage(error as Error, 'delete');
                setCustomError(errorMessage);
                toast.error(errorMessage);
                console.error('Failed to delete image:', error);
            } finally {
                setIsProcessing(false);
                setOperationStatus({ type: null, message: '' });
            }
        }, [value, visibleImages, onChange, onImageDelete, minImages, maxImages]);

        // Handle image reordering
        const handleImageReorder = React.useCallback(async (fromIndex: number, toIndex: number) => {
            if (!value || !allowReorder || fromIndex === toIndex) return;

            setIsProcessing(true);
            setOperationStatus({ type: 'reorder', message: 'Reordering images...' });

            try {
                // Find the actual indices in the original array based on visible images
                const fromImage = visibleImages[fromIndex];
                const toImage = visibleImages[toIndex];

                const actualFromIndex = value.findIndex(img => img.key === fromImage.key);
                const actualToIndex = value.findIndex(img => img.key === toImage.key);

                if (actualFromIndex === -1 || actualToIndex === -1) return;

                const reorderedImages = reorderImages(value, actualFromIndex, actualToIndex);
                await onChange?.(reorderedImages);
                await onImageReorder?.(actualFromIndex, actualToIndex);
                
                toast.success('Images reordered successfully');
            } catch (error) {
                const errorMessage = createImageErrorMessage(error as Error, 'reorder');
                setCustomError(errorMessage);
                toast.error(errorMessage);
                console.error('Failed to reorder images:', error);
            } finally {
                setIsProcessing(false);
                setOperationStatus({ type: null, message: '' });
            }
        }, [value, visibleImages, allowReorder, onChange, onImageReorder]);

        // Handle delete confirmation
        const handleDeleteConfirm = React.useCallback(() => {
            if (deleteIndex !== null) {
                handleImageDelete(deleteIndex);
                setDeleteIndex(null);
            }
        }, [deleteIndex, handleImageDelete]);

        const handleDeleteCancel = React.useCallback(() => {
            setDeleteIndex(null);
        }, []);

        // dropzone configuration
        const {
            getRootProps,
            getInputProps,
            fileRejections,
            isFocused,
            isDragAccept,
            isDragReject,
        } = useDropzone({
            accept: { 'image/*': [] },
            disabled,
            onDrop: async (acceptedFiles) => {
                const files = acceptedFiles;
                setCustomError(undefined);
                setIsProcessing(true);
                setOperationStatus({ type: 'upload', message: `Processing ${files.length} image${files.length > 1 ? 's' : ''}...` });
                
                // Validate add operation before processing
                const currentImages = value || [];
                const addValidation = validateImageOperationRealTime(
                    currentImages,
                    'add',
                    minImages,
                    maxImages
                );
                
                const currentVisibleCount = getVisibleImages(currentImages).length;
                const totalAfterUpload = currentVisibleCount + files.length;

                if (dropzoneOptions?.maxFiles && totalAfterUpload > dropzoneOptions.maxFiles) {
                    const errorMsg = ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles);
                    setCustomError(errorMsg);
                    toast.error(errorMsg);
                    setIsProcessing(false);
                    setOperationStatus({ type: null, message: '' });
                    return;
                }

                if (totalAfterUpload > maxImages) {
                    const errorMsg = `Maximum ${maxImages} images allowed. You're trying to add ${files.length} more to ${currentVisibleCount} existing images.`;
                    setCustomError(errorMsg);
                    toast.error(errorMsg);
                    setIsProcessing(false);
                    setOperationStatus({ type: null, message: '' });
                    return;
                }
                
                // Show validation warnings for add operation
                if (addValidation.warnings.length > 0) {
                    addValidation.warnings.forEach(warning => toast.warning(warning));
                }
                
                if (files) {
                    try {
                        setOperationStatus({ type: 'upload', message: 'Converting images to WebP...' });
                        
                        // Convert all images to WebP
                        const convertedFiles = await convertMultipleImagesToWebP(files);

                        const startOrder = value?.length ?? 0;
                        const addedFiles = convertedFiles.map<FileState>((file, index) => ({
                            file,
                            key: Math.random().toString(36).slice(2),
                            progress: 'PENDING',
                            isExisting: false,
                            isDeleted: false,
                            order: startOrder + index,
                        }));

                        const updatedFiles = addImages(value ?? [], addedFiles);
                        void onFilesAdded?.(addedFiles);
                        void onChange?.(updatedFiles);
                        
                        toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added successfully`);
                    } catch (error) {
                        console.error('Failed to convert images to WebP:', error);
                        toast.warning('WebP conversion failed, using original format');
                        
                        // Fallback to original files if conversion fails
                        const startOrder = value?.length ?? 0;
                        const addedFiles = files.map<FileState>((file, index) => ({
                            file,
                            key: Math.random().toString(36).slice(2),
                            progress: 'PENDING',
                            isExisting: false,
                            isDeleted: false,
                            order: startOrder + index,
                        }));

                        const updatedFiles = addImages(value ?? [], addedFiles);
                        void onFilesAdded?.(addedFiles);
                        void onChange?.(updatedFiles);
                        
                        toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added (original format)`);
                    } finally {
                        setIsProcessing(false);
                        setOperationStatus({ type: null, message: '' });
                    }
                }
            },
            ...dropzoneOptions,
        });

        // styling
        const dropZoneClassName = React.useMemo(
            () =>
                twMerge(
                    variants.base,
                    isFocused && variants.active,
                    disabled && variants.disabled,
                    (isDragReject ?? fileRejections[0]) && variants.reject,
                    isDragAccept && variants.accept,
                    className,
                ).trim(),
            [
                isFocused,
                fileRejections,
                isDragAccept,
                isDragReject,
                disabled,
                className,
            ],
        );

        // error validation messages
        const errorMessage = React.useMemo(() => {
            if (fileRejections[0]) {
                const { errors } = fileRejections[0];
                if (errors[0]?.code === 'file-too-large') {
                    return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
                } else if (errors[0]?.code === 'file-invalid-type') {
                    return ERROR_MESSAGES.fileInvalidType();
                } else if (errors[0]?.code === 'too-many-files') {
                    return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
                } else {
                    return ERROR_MESSAGES.fileNotSupported();
                }
            }
            return undefined;
        }, [fileRejections, dropzoneOptions]);

        return (
            <div className="w-full space-y-4">
                <div className="w-full relative">
                    {
                        visibleImages.length > 0 &&
                        <div className={'space-y-3 pb-3'}>

                            {
                                visibleImages.map(({ file, progress }, index) => (
                                    typeof progress === 'number' && (
                                        <div key={visibleImages[index].key} className={'flex text-sm'}>
                                            <Progress value={progress} />
                                        </div>
                                    )
                                ))
                            }

                        </div>
                    }

                    {/* Dropzone */}
                    {(!visibleImages || visibleImages.length < (dropzoneOptions?.maxFiles ?? maxImages)) && (
                        <div
                            {...getRootProps({
                                className: dropZoneClassName,
                            })}
                        >
                            {/* Main File Input */}
                            <input ref={ref} {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center text-center p-6">
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mb-4 h-12 w-12 text-blue-500 animate-spin" />
                                        <div className="text-blue-600 dark:text-blue-400 text-lg font-medium mb-2">
                                            {operationStatus.message}
                                        </div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                                            Please wait...
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ImageUp className="stroke-1 mb-4 h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                        <div className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                            Drag & drop images here
                                        </div>
                                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                            or click to browse files
                                        </div>
                                        <Button 
                                            variant={'outline'} 
                                            type={'button'} 
                                            disabled={disabled || isProcessing} 
                                            className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-200"
                                            loading={isProcessing}
                                        >
                                            <Camera className="stroke-1 mr-2 h-5 w-5" />
                                            Upload Photos
                                        </Button>
                                        <div className="text-xs text-gray-400 mt-3">
                                            Support: JPG, PNG, GIF (Max: {formatFileSize(dropzoneOptions?.maxSize ?? 5242880)})
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Operation Status Indicator */}
                {isProcessing && operationStatus.type && (
                    <div className="flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                            {operationStatus.message}
                        </span>
                    </div>
                )}

                {/* Sortable Image Grid */}
                {visibleImages.length > 0 && (
                    <SortableImageGrid
                        images={visibleImages}
                        onReorder={handleImageReorder}
                        onDelete={showDeleteConfirmation ? (index) => setDeleteIndex(index) : handleImageDelete}
                        allowDelete={allowDelete}
                        allowReorder={allowReorder}
                        disabled={disabled || isProcessing}
                        className="mt-4"
                        gridColumns={4}
                        isProcessing={isProcessing}
                    />
                )}

                {/* Image Count Display */}
                {visibleImages.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {/* Image Count Display */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                <span className="font-medium">{imageValidation.counts.visible}</span>
                                <span className="mx-1">of</span>
                                <span className="font-medium">{maxImages}</span>
                                <span className="ml-1">images</span>
                                {imageValidation.counts.deleted > 0 && (
                                    <span className="text-gray-500 ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                                        {imageValidation.counts.deleted} deleted
                                    </span>
                                )}
                                {isProcessing && (
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-500 ml-2" />
                                )}
                            </span>
                            
                            {/* Validation Status Indicator */}
                            <div className="flex items-center space-x-2">
                                {imageValidation.isValid ? (
                                    <span className="text-green-600 text-xs flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Valid
                                    </span>
                                ) : (
                                    <span className="text-red-600 text-xs flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {imageValidation.counts.visible < minImages ? 'Need more' : 'Too many'}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Enhanced Progress Bar for Image Requirements */}
                        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ease-out ${
                                    imageValidation.counts.visible < minImages 
                                        ? 'bg-gradient-to-r from-orange-400 to-orange-500' 
                                        : imageValidation.counts.visible > maxImages 
                                        ? 'bg-gradient-to-r from-red-400 to-red-500' 
                                        : 'bg-gradient-to-r from-green-400 to-green-500'
                                }`}
                                style={{ 
                                    width: `${Math.min((imageValidation.counts.visible / maxImages) * 100, 100)}%` 
                                }}
                            />
                            {/* Minimum requirement indicator */}
                            <div 
                                className="absolute top-0 h-full w-0.5 bg-gray-400 dark:bg-gray-500"
                                style={{ left: `${(minImages / maxImages) * 100}%` }}
                            />
                        </div>
                        
                        {/* Detailed Count Breakdown */}
                        {(imageValidation.counts.existing > 0 || imageValidation.counts.new > 0) && (
                            <div className="text-xs text-gray-500 flex space-x-4">
                                {imageValidation.counts.existing > 0 && (
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                                        {imageValidation.counts.existing} existing
                                    </span>
                                )}
                                {imageValidation.counts.new > 0 && (
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                                        {imageValidation.counts.new} new
                                    </span>
                                )}
                                {imageValidation.counts.deleted > 0 && (
                                    <span className="flex items-center">
                                        <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                                        {imageValidation.counts.deleted} deleted
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Error Text */}
                <div className="mt-2 space-y-1">
                    {/* Custom errors (upload/operation errors) */}
                    {customError && (
                        <div className="text-xs text-red-500 flex items-start">
                            <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {customError}
                        </div>
                    )}
                    
                    {/* Dropzone errors */}
                    {errorMessage && (
                        <div className="text-xs text-red-500 flex items-start">
                            <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errorMessage}
                        </div>
                    )}
                    
                    {/* Validation errors */}
                    {!customError && !errorMessage && imageValidation.hasErrors && (
                        <div className="text-xs text-red-500 flex items-start">
                            <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {imageValidation.errorMessage}
                        </div>
                    )}
                    
                    {/* Validation warnings */}
                    {!customError && !errorMessage && !imageValidation.hasErrors && imageValidation.hasWarnings && (
                        <div className="text-xs text-orange-500 flex items-start">
                            <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {imageValidation.warningMessage}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirmation && deleteIndex !== null && (
                    <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this image?
                                    {visibleImages[deleteIndex]?.isExisting
                                        ? " This action will permanently remove the image from the property."
                                        : " This action cannot be undone."
                                    }
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleDeleteCancel}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        );
    },
);
MultiImageDropzone.displayName = 'MultiImageDropzone';

// const Button = React.forwardRef<
//     HTMLButtonElement,
//     React.ButtonHTMLAttributes<HTMLButtonElement>
// >(({className, ...props}, ref) => {
//     return (
//         <button
//             className={twMerge(
//                 // base
//                 'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
//                 // color
//                 'border border-gray-400 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
//                 // size
//                 'h-6 rounded-md px-2 text-xs',
//                 className,
//             )}
//             ref={ref}
//             {...props}
//         />
//     );
// });
// Button.displayName = 'Button';

export { MultiImageDropzone };

function CircleProgress({ progress }: { progress: number }) {
    const strokeWidth = 10;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative h-16 w-16">
            <svg
                className="absolute top-0 left-0 -rotate-90 transform"
                width="100%"
                height="100%"
                viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2
                    }`}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="text-gray-400"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                />
                <circle
                    className="text-white transition-all duration-300 ease-in-out"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={((100 - progress) / 100) * circumference}
                    strokeLinecap="round"
                    fill="none"
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    r={radius}
                />
            </svg>
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs text-white">
                {Math.round(progress)}%
            </div>
        </div>
    );
}