import {z} from "zod";

export const PropertyFormSchema = z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    countryId: z.string(),
    stateId: z.string(),
    city: z.object({
        label: z.string(),
        value: z.string()
    }),
    community: z.object({
        label: z.string(),
        value: z.string()
    }),
    location: z.string(),
    price: z.number(),
    type: z.string(),
    amenities: z.array(z.object({
        label: z.string(),
        value: z.string()
    })),
    bedrooms: z.number(),
    bathrooms: z.number(),
    developer: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    offeringType: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    propertyType: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    longitude: z.string(),
    latitude: z.string(),
    floor: z.number().nullable(),
    cheques: z.number().nullable(),
    permitNumber: z.string().nullable(),
    plotSize: z.number().nullable(),
    bua: z.number().nullable(),
    size: z.number(),
    buildYear: z.string(),
    availabilityDate: z.date().nullable(),
    subCommunity: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    unitType: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    status: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    availabilityStatus: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    completionStatus: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),

    parking: z.number().nullable(),
    referenceNumber: z.string().nullable(),
    serviceCharge: z.number().nullable(),
    furnishing: z.object({
        label: z.string(),
        value: z.string()
    }).nullable(),
    images: z.array(z.any())
})
