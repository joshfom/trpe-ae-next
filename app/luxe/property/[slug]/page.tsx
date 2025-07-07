import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {db} from '@/db/drizzle';
import {propertyTable} from '@/db/schema/property-table';
import {and, eq} from 'drizzle-orm';
import {PropertyType} from '@/types/property';
import OptimizedLuxePropertyDetail from './OptimizedLuxePropertyDetail';

interface LuxePropertyPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LuxePropertyPageProps): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const property = await db.query.propertyTable.findFirst({
            where: eq(propertyTable.slug, slug),
            with: {
                offeringType: true,
                images: true,
                community: true,
                city: true,
            }
        }) as unknown as PropertyType;
        
        if (!property) {
            return {
                title: 'Property Not Found | TRPE Luxe',
                description: 'The requested luxury property could not be found.'
            };
        }

        return {
            title: `${property.title} | TRPE Luxe`,
            description: property.description 
                ? property.description.substring(0, 160).replace(/<[^>]*>/g, '') + '...'
                : `Luxury ${property.offeringType?.name || 'property'} in ${property.community?.name}, ${property.city?.name}`,
            openGraph: {
                title: property.title,
                description: property.description?.substring(0, 160).replace(/<[^>]*>/g, '') + '...' || '',
                images: property.images?.[0]?.crmUrl ? [property.images[0].crmUrl] : [],
                type: 'website',
            },
        };
    } catch (error) {
        return {
            title: 'Property Not Found | TRPE Luxe',
            description: 'The requested luxury property could not be found.'
        };
    }
}

export default async function LuxePropertyPage({ params }: LuxePropertyPageProps) {
    const { slug } = await params;
    
    try {
        // Fetch the property data using database query with isLuxe filter
        const property = await db.query.propertyTable.findFirst({
            where: and(
                eq(propertyTable.slug, slug),
                eq(propertyTable.isLuxe, true) // Only fetch if it's marked as luxe
            ),
            with: {
                agent: true,
                community: true,
                city: true,
                offeringType: true,
                images: true,
                subCommunity: true,
            }
        }) as unknown as PropertyType;
        
        if (!property) {
            notFound();
        }

        return <OptimizedLuxePropertyDetail property={property} />;
        
    } catch (error) {
        console.error('Error fetching property:', error);
        notFound();
    }
}