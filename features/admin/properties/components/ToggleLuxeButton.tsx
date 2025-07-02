"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { togglePropertyLuxeAction } from '@/actions/toggle-property-luxe-action';
import { toast } from 'sonner';

interface ToggleLuxeButtonProps {
  propertyId: string;
  isLuxe: boolean;
}

export function ToggleLuxeButton({ propertyId, isLuxe }: ToggleLuxeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLuxeStatus, setCurrentLuxeStatus] = useState(isLuxe);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      const result = await togglePropertyLuxeAction(propertyId, !currentLuxeStatus);
      
      if (result.success) {
        setCurrentLuxeStatus(!currentLuxeStatus);
        toast.success(result.message);
        
        // Reload the page to see updated data
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to update property');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error toggling luxe status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={currentLuxeStatus ? "default" : "outline"}
      size="sm"
      className={`h-6 px-2 text-xs ${
        currentLuxeStatus 
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
          : 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'
      }`}
    >
      <Crown size={10} className="mr-1" />
      {isLoading ? '...' : currentLuxeStatus ? 'Luxe' : 'Mark Luxe'}
    </Button>
  );
}
