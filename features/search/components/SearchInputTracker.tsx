'use client';

import { Input } from "@/components/ui/input";
import { pushToDataLayer } from '@/lib/gtm';
import { Search } from "lucide-react";
import { useState, useRef } from 'react';

interface SearchInputTrackerProps {
    placeholder: string;
    searchLocation: string;
    mode: string;
}

export default function SearchInputTracker({ placeholder, searchLocation, mode }: SearchInputTrackerProps) {
    const [hasFocused, setHasFocused] = useState(false);
    const typingTimer = useRef<NodeJS.Timeout | null>(null);

    const handleFocus = () => {
        if (!hasFocused) {
            setHasFocused(true);
            pushToDataLayer({
                event: 'search_input_focused',
                search_location: searchLocation,
                search_mode: mode,
                component: 'server_search',
                timestamp: new Date().toISOString()
            });
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Clear previous timer
        if (typingTimer.current) {
            clearTimeout(typingTimer.current);
        }

        // Set new timer to track typing after user stops for 1 second
        typingTimer.current = setTimeout(() => {
            if (value.length > 0) {
                pushToDataLayer({
                    event: 'search_input_typing',
                    search_query_length: value.length,
                    search_location: searchLocation,
                    search_mode: mode,
                    component: 'server_search',
                    timestamp: new Date().toISOString()
                });
            }
        }, 1000);
    };

    return (
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
                placeholder={placeholder}
                className="pl-10 border-0 focus:ring-0 text-lg h-12"
                disabled // Disabled in server version - will be enhanced client-side
                onFocus={handleFocus}
                onChange={handleInput}
            />
        </div>
    );
}
