import { revalidateTag } from 'next/cache';

/**
 * Cache revalidation utilities for SSR optimization
 * These functions help invalidate cached data when content changes
 */

export async function revalidateHomepage() {
    try {
        revalidateTag('homepage');
        revalidateTag('listings');
        revalidateTag('communities');
        revalidateTag('offering-types');
        console.log('Homepage cache revalidated successfully');
    } catch (error) {
        console.error('Error revalidating homepage cache:', error);
    }
}

export async function revalidateListings(offeringTypeId?: string) {
    try {
        revalidateTag('listings');
        if (offeringTypeId) {
            revalidateTag(`offerings-${offeringTypeId}`);
        }
        console.log('Listings cache revalidated successfully');
    } catch (error) {
        console.error('Error revalidating listings cache:', error);
    }
}

export async function revalidateCommunities() {
    try {
        revalidateTag('communities');
        revalidateTag('homepage');
        console.log('Communities cache revalidated successfully');
    } catch (error) {
        console.error('Error revalidating communities cache:', error);
    }
}

export async function revalidateOfferingTypes() {
    try {
        revalidateTag('offering-types');
        revalidateTag('homepage');
        console.log('Offering types cache revalidated successfully');
    } catch (error) {
        console.error('Error revalidating offering types cache:', error);
    }
}

// Comprehensive cache revalidation for admin updates
export async function revalidateAllContent() {
    try {
        await Promise.all([
            revalidateHomepage(),
            revalidateListings(),
            revalidateCommunities(),
            revalidateOfferingTypes()
        ]);
        console.log('All content cache revalidated successfully');
    } catch (error) {
        console.error('Error revalidating all content cache:', error);
    }
}
