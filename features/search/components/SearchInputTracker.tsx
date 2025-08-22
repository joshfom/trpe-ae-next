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
        <div className="w-full grow relative">
            <div className="flex flex-col">
                <div className="text-gray-700 px-3 text-sm">
                    Search
                </div>
                <Input
                    placeholder={placeholder}
                    className="grow border-t-0 border-l-0 py-1 -mt-1 border-r-0 rounded-none focus-visible:ring-0 border-white bg-transparent text-lg"
                    disabled // Disabled in server version - will be enhanced client-side
                    onFocus={handleFocus}
                    onChange={handleInput}
                />
            </div>
        </div>
    );
}
