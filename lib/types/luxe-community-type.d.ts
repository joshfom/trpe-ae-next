// Luxe Community Type Definition
export interface LuxeCommunityType {
    id: string;
    communityId: string;
    
    // Luxe-specific content fields
    name: string;
    metaTitle?: string | null;
    metaDesc?: string | null;
    about?: string | null;
    image?: string | null;
    heroImage?: string | null;
    
    // Display settings
    featured?: boolean | null;
    displayOrder?: number | null;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    
    // Relation to original community
    community?: CommunityType;
}
