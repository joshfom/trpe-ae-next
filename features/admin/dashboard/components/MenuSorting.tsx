"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Grid2X2, LayoutGrid, List, SortDesc } from "lucide-react";

interface MenuSortingProps {
    onViewChange?: (view: 'grid' | 'list') => void;
    onSortChange?: (sort: string) => void;
}

const MenuSorting: React.FC<MenuSortingProps> = ({ onViewChange, onSortChange }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-xl font-semibold">Workspace Dashboard</h2>
                <p className="text-gray-500">Manage your properties, content, and settings</p>
            </div>
            
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <SortDesc className="h-4 w-4 mr-2" />
                            Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSortChange?.('newest')}>
                            Newest
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange?.('oldest')}>
                            Oldest
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange?.('a-z')}>
                            A-Z
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSortChange?.('z-a')}>
                            Z-A
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex items-center border rounded-md overflow-hidden">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewChange?.('grid')}
                        className="rounded-none border-r"
                    >
                        <Grid2X2 className="h-4 w-4" />
                        <span className="sr-only">Grid view</span>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onViewChange?.('list')}
                    >
                        <List className="h-4 w-4" />
                        <span className="sr-only">List view</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MenuSorting;
