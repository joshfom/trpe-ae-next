import React from 'react';
import { X } from 'lucide-react';
import { CommunityFilterType } from '@/features/search/types/property-search.types';
import { cn } from "@/lib/utils";

interface SelectedCommunitiesListProps {
    selectedCommunities: CommunityFilterType[];  // Now properly typed with complete interface
    setSelectedCommunities: React.Dispatch<React.SetStateAction<CommunityFilterType[]>>;
    classNames?: string;
    variant?: 'default' | 'compact';
}

const SelectedCommunitiesList: React.FC<SelectedCommunitiesListProps> = ({
                                                                             selectedCommunities,
                                                                             setSelectedCommunities,
                                                                             classNames,
                                                                             variant = 'default'
                                                                         }) => {
    // Function to handle removing a community from the selected list
    const handleRemoveCommunity = (communityId: string) => {
        setSelectedCommunities(prevCommunities =>
            prevCommunities.filter(community => community.id !== communityId)
        );
    };

    // If there are no selected communities, don't render anything
    if (selectedCommunities.length === 0) {
        return null;
    }

    const containerStyles = variant === 'default'
        ? 'w-full rounded-full px-3 py-2 bg-white shadow-sm border mb-2'
        : 'w-full px-2';

    const tagStyles = variant === 'default'
        ? 'border rounded-full hover:text-red-600 hover:border-red-600 px-4 py-1'
        : 'border rounded-full hover:text-red-600 hover:border-red-600 px-3 py-0.5 text-sm';

    return (
        <div className={cn(containerStyles, 'flex flex-wrap gap-4 overflow-y-auto', classNames)}>
            {selectedCommunities.map((community) => (
                <button
                    key={community.id}         // Use id instead of slug for key
                    type="button"
                    onClick={() => handleRemoveCommunity(community.id)}
                    className={cn(
                        'flex group items-center transition-colors duration-200',
                        tagStyles
                    )}
                    aria-label={`Remove ${community.name} from selected communities`}
                >
                    <span>{community.shortName || community.name}</span>
                    <X
                        className="h-4 w-4 ml-2 stroke-1 group-hover:text-red-500"
                        aria-hidden="true"
                    />
                </button>
            ))}
        </div>
    );
};

export default SelectedCommunitiesList;