import { z } from 'zod';

export const luxePropertyFormSchema = z.object({
    // Basic Information
    name: z.string().min(1, 'Property name is required'),
    description: z.string().min(1, 'Description is required'),
    slug: z.string().min(1, 'Slug is required'),
    
    // Property Details
    bedrooms: z.number().min(0),
    bathrooms: z.number().min(0),
    price: z.number().min(0),
    size: z.number().min(0),
    plotSize: z.number().optional(),
    floor: z.string().optional(),
    buildYear: z.string().optional(),
    
    // Location
    communityId: z.string().min(1, 'Community is required'),
    subCommunityId: z.string().optional(),
    cityId: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    
    // Property Types
    typeId: z.string().min(1, 'Property type is required'),
    offeringTypeId: z.string().min(1, 'Offering type is required'),
    unitTypeId: z.string().optional(),
    
    // Status & Availability
    availability: z.enum(['available', 'unavailable', 'sold', 'rented', 'off_market', 'under_offer', 'others']).default('available'),
    status: z.enum(['draft', 'published', 'unpublished']).default('draft'),
    availabilityDate: z.string().optional(),
    offplanCompletionStatus: z.enum(['offplan_primary', 'offplan_secondary', 'ready_primary', 'ready_secondary']).optional(),
    furnished: z.enum(['furnished', 'unfurnished', 'semi_furnished']).optional(),
    
    // Additional Details
    parking: z.string().optional(),
    serviceCharge: z.string().optional(),
    cheques: z.string().optional(),
    
    // Relationships
    agentId: z.string().min(1, 'Agent is required'),
    developerId: z.string().optional(),
    
    // Features & Flags
    isFeatured: z.boolean().default(false),
    isExclusive: z.boolean().default(false),
    isLuxe: z.boolean().default(true), // Always true for luxe properties
    
    // Reference Information
    referenceNumber: z.string().optional(),
    permitNumber: z.string().min(1, 'Permit number is required'),
    
    // Images (minimum 6, maximum 20) - Enhanced validation with better error messages
    images: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        order: z.number().min(0, 'Image order must be non-negative')
    })).min(6, 'Minimum 6 images required for luxe properties').max(20, 'Maximum 20 images allowed to maintain performance'),
    
    // Optional: Enhanced image operations for server actions
    imageOperations: z.object({
        imagesToDelete: z.array(z.string()),
        newImages: z.array(z.object({
            file: z.string(), // Uploaded URL
            order: z.number()
        })),
        orderUpdates: z.array(z.object({
            id: z.string(),
            order: z.number()
        })),
        existingImages: z.array(z.object({
            id: z.string(),
            url: z.string(),
            order: z.number()
        }))
    }).optional()
});
