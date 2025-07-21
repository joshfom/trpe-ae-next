"use client"
import React, {useEffect, useMemo} from 'react';
import {useEdgeStore} from "@/db/edgestore";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {MultiImageDropzone} from "@/components/multi-image-dropzone";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {luxePropertyFormSchema} from "@/features/admin/luxe/properties/form-schema/luxe-property-form-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { FileState } from "@/components/multi-image-dropzone";
import { createLuxePropertyAction, updateLuxePropertyAction } from '@/actions/admin/luxe/properties/luxe-property-actions';
import { toast } from 'sonner';
import { TipTapEditor } from "@/components/TiptapEditor";
import { useGetLuxeAgents } from "@/features/admin/luxe/agents/api/use-get-luxe-agents";
import { useGetAdminCommunities } from "@/features/admin/community/api/use-get-admin-communities";
import { useGetAdminPropertyTypes } from "@/features/admin/property-types/api/use-get-admin-property-types";
import { useGetAdminOfferingTypes } from "@/features/admin/offering/api/use-get-admin-offering-types";
import { validateLuxePropertySlugAction, generateSlugFromTitleAction } from "@/actions/admin/luxe/properties/validate-slug-action";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

type FormValues = z.infer<typeof luxePropertyFormSchema>

interface LuxePropertyFormProps {
    property?: any; // TODO: Type this properly
    propertySlug?: string;
}

function LuxePropertyForm({property, propertySlug}: LuxePropertyFormProps) {
    const [fileStates, setFileStates] = React.useState<FileState[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [slugValidating, setSlugValidating] = React.useState(false);
    const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);
    const {edgestore} = useEdgeStore();
    const router = useRouter();
    const [isEditing, setIsEditing] = React.useState(false);

    // API calls
    const luxeAgentsQuery = useGetLuxeAgents();
    const adminCommunitiesQuery = useGetAdminCommunities();
    const propertyTypesQuery = useGetAdminPropertyTypes();
    const offeringTypesQuery = useGetAdminOfferingTypes();

    const luxeAgents = React.useMemo(() => {
        const data = luxeAgentsQuery.data;
        if (!data || !Array.isArray(data)) return [];
        return data.filter(agent => agent && agent.id);
    }, [luxeAgentsQuery.data]);
    const allCommunities = React.useMemo(() => {
        const data = adminCommunitiesQuery.data;
        if (!data || !Array.isArray(data)) return [];
        return data.filter(community => community && community.id);
    }, [adminCommunitiesQuery.data]);
    const propertyTypes = React.useMemo(() => {
        const data = propertyTypesQuery.data;
        if (!data || !Array.isArray(data)) return [];
        return data.filter(type => type && type.id);
    }, [propertyTypesQuery.data]);

    const offeringTypes = React.useMemo(() => {
        const data = offeringTypesQuery.data;
        if (!data || !Array.isArray(data)) return [];
        return data.filter(type => type && type.id);
    }, [offeringTypesQuery.data]);

    const form = useForm<FormValues>({
        mode: "onChange",
        resolver: zodResolver(luxePropertyFormSchema),
        defaultValues: {
            name: property?.name || '',
            description: property?.description || '',
            slug: property?.slug || '',
            bedrooms: property?.bedrooms || 0,
            bathrooms: property?.bathrooms || 0,
            price: property?.price || 0,
            size: property?.size || 0,
            plotSize: property?.plotSize || undefined,
            floor: property?.floor || '',
            buildYear: property?.buildYear || '',
            communityId: property?.communityId || '',
            subCommunityId: property?.subCommunityId || '',
            cityId: property?.cityId || '',
            latitude: property?.latitude || '',
            longitude: property?.longitude || '',
            typeId: property?.typeId || '',
            offeringTypeId: property?.offeringTypeId || '',
            unitTypeId: property?.unitTypeId || '',
            availability: property?.availability || 'available',
            status: property?.status || 'draft',
            availabilityDate: property?.availabilityDate || '',
            offplanCompletionStatus: property?.offplanCompletionStatus || undefined,
            furnished: property?.furnished || undefined,
            parking: property?.parking || '',
            serviceCharge: property?.serviceCharge || '',
            cheques: property?.cheques || '',
            agentId: property?.agentId || '',
            developerId: property?.developerId || '',
            isFeatured: property?.isFeatured || false,
            isExclusive: property?.isExclusive || false,
            isLuxe: true, // Always true for luxe properties
            referenceNumber: property?.referenceNumber || '',
            permitNumber: property?.permitNumber || '',
            images: property?.images || []
        }
    });

    useEffect(() => {
        if (property || propertySlug) {
            setIsEditing(true);
            // If editing and has existing slug, mark as manually edited to prevent auto-updates
            if (property?.slug) {
                setSlugManuallyEdited(true);
            }
        }
    }, [property, propertySlug]);

    // Auto-generate slug from title
    const handleTitleBlur = async (title: string) => {
        // Only auto-generate if slug is empty OR if slug hasn't been manually edited
        if (!title || (form.getValues('slug') && slugManuallyEdited)) return;
        
        const result = await generateSlugFromTitleAction(title, property?.id);
        if (result.success) {
            form.setValue('slug', result.slug);
        }
    };

    // Handle manual name/title changes
    const handleTitleChange = async (title: string) => {
        // Auto-generate slug in real-time as user types (only if not manually edited)
        if (title && !slugManuallyEdited) {
            const result = await generateSlugFromTitleAction(title, property?.id);
            if (result.success) {
                form.setValue('slug', result.slug);
            }
        }
    };

    // Validate slug on blur and mark as manually edited
    const handleSlugBlur = async (slug: string) => {
        if (!slug) return;
        
        // Mark as manually edited when user touches the slug field
        setSlugManuallyEdited(true);
        
        setSlugValidating(true);
        const result = await validateLuxePropertySlugAction(slug, property?.id);
        setSlugValidating(false);
        
        if (result.success) {
            // Always use the suggested slug which is properly formatted
            if (result.suggestedSlug !== slug) {
                form.setValue('slug', result.suggestedSlug);
                if (!result.isUnique) {
                    toast.info(`Slug was not unique. Changed to: ${result.suggestedSlug}`);
                } else {
                    toast.info(`Slug formatted to: ${result.suggestedSlug}`);
                }
            }
        }
    };

    // Regenerate slug from current title
    const handleRegenerateSlug = async () => {
        const currentTitle = form.getValues('name');
        if (!currentTitle) {
            toast.error('Please enter a property title first');
            return;
        }
        
        setSlugValidating(true);
        const result = await generateSlugFromTitleAction(currentTitle, property?.id);
        setSlugValidating(false);
        
        if (result.success) {
            form.setValue('slug', result.slug);
            setSlugManuallyEdited(false); // Reset manual edit flag
            toast.success('Slug regenerated from title');
        } else {
            toast.error('Failed to regenerate slug');
        }
    };

    // Handle multiple image uploads
    const updateImages = async (fileStates: FileState[]) => {
        const uploadedImages = [];
        
        for (let i = 0; i < fileStates.length; i++) {
            const fileState = fileStates[i];
            // Check if it's a File object (not a string URL) and is pending upload
            if (fileState.file instanceof File && fileState.progress === 'PENDING') {
                try {
                    const res = await edgestore.publicFiles.upload({
                        file: fileState.file,
                        onProgressChange: (progress) => {
                            setFileStates(prev => prev.map((state, index) => 
                                index === i ? { ...state, progress } : state
                            ));
                        },
                    });
                    
                    uploadedImages.push({
                        url: res.url,
                        order: i
                    });
                    
                    setFileStates(prev => prev.map((state, index) => 
                        index === i ? { ...state, progress: 'COMPLETE', file: res.url } : state
                    ));
                } catch (error) {
                    setFileStates(prev => prev.map((state, index) => 
                        index === i ? { ...state, progress: 'ERROR' } : state
                    ));
                }
            }
        }
        
        // Update form with all images (existing + newly uploaded)
        const allImages: Array<{url: string; order: number}> = [];
        
        // Add existing completed images
        fileStates.forEach((fileState, index) => {
            if (fileState.progress === 'COMPLETE') {
                // For completed uploads, the file should be a URL string
                const url = typeof fileState.file === 'string' ? fileState.file : URL.createObjectURL(fileState.file);
                allImages.push({
                    url: url,
                    order: index
                });
            } else if (typeof fileState.file === 'string') {
                // For existing images that are already URLs
                allImages.push({
                    url: fileState.file,
                    order: index
                });
            }
        });
        
        // Add newly uploaded images
        uploadedImages.forEach(image => {
            allImages.push(image);
        });
        
        form.setValue('images', allImages);
    };

    const onSubmit = async (values: FormValues) => {
        console.log('Form values:', values);
        setIsSubmitting(true);
        
        try {
            let result;
            
            if (isEditing && (property?.slug || propertySlug)) {
                // Update existing property
                const propertyId = property?.id || propertySlug;
                result = await updateLuxePropertyAction(propertyId, values);
            } else {
                // Create new property
                result = await createLuxePropertyAction(values);
            }
            
            if (result.success) {
                toast.success(result.message);
                form.reset();
                setFileStates([]);
                
                if (isEditing) {
                    router.refresh();
                } else {
                    router.push('/admin/luxe/properties');
                }
            } else {
                toast.error(result.message);
                if (result.errors) {
                    console.error('Validation errors:', result.errors);
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            {/* Loading state for API calls */}
            {(luxeAgentsQuery.isLoading || adminCommunitiesQuery.isLoading || 
              propertyTypesQuery.isLoading || offeringTypesQuery.isLoading) && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading form data...</span>
                </div>
            )}

            {/* Error state */}
            {(luxeAgentsQuery.isError || adminCommunitiesQuery.isError || 
              propertyTypesQuery.error || offeringTypesQuery.error) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="text-red-800 font-medium">Error loading form data</h3>
                    <p className="text-red-600 text-sm mt-1">
                        Please refresh the page or contact support if the issue persists.
                    </p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Property Title - Full Width */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Property Title *</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Property title" 
                                                {...field} 
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleTitleChange(e.target.value);
                                                }}
                                                onBlur={(e) => {
                                                    field.onBlur();
                                                    handleTitleBlur(e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            
                            {/* Slug - Full Width with Validation and Regenerate Button */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            Slug * 
                                            {slugManuallyEdited && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Manual
                                                </Badge>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative flex gap-2">
                                                <Input 
                                                    placeholder="property-slug" 
                                                    {...field} 
                                                    className="flex-1"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setSlugManuallyEdited(true);
                                                    }}
                                                    onBlur={(e) => {
                                                        field.onBlur();
                                                        handleSlugBlur(e.target.value);
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleRegenerateSlug}
                                                    disabled={slugValidating || !form.getValues('name')}
                                                    title="Regenerate slug from title"
                                                >
                                                    <RefreshCw className={`h-4 w-4 ${slugValidating ? 'animate-spin' : ''}`} />
                                                </Button>
                                                {slugValidating && (
                                                    <div className="absolute right-14 top-3">
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                        {slugManuallyEdited && (
                                            <p className="text-xs text-muted-foreground">
                                                Slug won't auto-update from title changes. Click regenerate to sync with title.
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Agent and Community Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="agentId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Luxe Agent *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Luxe Agent" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {luxeAgents.map((agent: any) => (
                                                        <SelectItem key={agent.id} value={agent.id}>
                                                            {agent.firstName} {agent.lastName}
                                                            {agent.title && (
                                                                <span className="text-sm text-muted-foreground ml-2">
                                                                    ({agent.title})
                                                                </span>
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="communityId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Community *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Community" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {allCommunities.map((community: any) => (
                                                        <SelectItem key={community.id} value={community.id}>
                                                            {community.title || community.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Property and Offering Types */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="typeId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Property Type *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Property Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-[300px]'>
                                                    {propertyTypes.map((type: any) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.title || type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="offeringTypeId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Offering Type *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Offering Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='w-[300px]'>
                                                    {offeringTypes.map((offering: any) => (
                                                        <SelectItem key={offering.id} value={offering.id}>
                                                            {offering.title || offering.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Property Description with TipTap Editor */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Property Description *</FormLabel>
                                        <FormControl>
                                            <TipTapEditor
                                                name="description"
                                                control={form.control}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Property Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="bedrooms"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Bedrooms *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="bathrooms"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Bathrooms *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Price (AED) *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="size"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Size (sqft) *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="plotSize"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Plot Size (sqft)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="floor"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Floor</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Ground, 1st, 2nd" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="buildYear"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Build Year</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 2023" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="availability"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Availability *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select availability" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="available">Available</SelectItem>
                                                    <SelectItem value="unavailable">Unavailable</SelectItem>
                                                    <SelectItem value="sold">Sold</SelectItem>
                                                    <SelectItem value="rented">Rented</SelectItem>
                                                    <SelectItem value="off_market">Off Market</SelectItem>
                                                    <SelectItem value="under_offer">Under Offer</SelectItem>
                                                    <SelectItem value="others">Others</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Status *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="unpublished">Unpublished</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="referenceNumber"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Reference Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="REF-12345" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="permitNumber"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Permit Number *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="PERMIT-12345" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Featured Property</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isExclusive"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Exclusive Property</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Images *</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Upload minimum 6 images (maximum 20) - High-quality images of the property
                            </p>
                        </CardHeader>
                        <CardContent className="w-full">
                            <FormField
                                control={form.control}
                                name="images"
                                render={({field}) => (
                                    <FormItem className="w-full">
                                        <FormControl className="w-full">
                                            <div className="w-full">
                                                <MultiImageDropzone
                                                    value={fileStates}
                                                    onChange={(files) => {
                                                        setFileStates(files);
                                                        updateImages(files);
                                                    }}
                                                    onFilesAdded={async (addedFiles) => {
                                                        setFileStates([...fileStates, ...addedFiles]);
                                                    }}
                                                    dropzoneOptions={{
                                                        maxFiles: 20,
                                                        maxSize: 5 * 1024 * 1024, // 5MB
                                                    }}
                                                />
                                                {/* Image count indicator */}
                                                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                                                    <span>
                                                        Images uploaded: {fileStates.filter(f => f.progress === 'COMPLETE' || typeof f.file === 'string').length} / 20
                                                    </span>
                                                    <span className={fileStates.filter(f => f.progress === 'COMPLETE' || typeof f.file === 'string').length >= 6 ? 'text-green-600' : 'text-red-500'}>
                                                        {fileStates.filter(f => f.progress === 'COMPLETE' || typeof f.file === 'string').length >= 6 ? '✓ Minimum met' : `Need ${6 - fileStates.filter(f => f.progress === 'COMPLETE' || typeof f.file === 'string').length} more`}
                                                    </span>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-8">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="min-w-32"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Update Property' : 'Create Property'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default LuxePropertyForm;
