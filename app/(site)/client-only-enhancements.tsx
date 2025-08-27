'use client'

import React, { useEffect } from 'react';

// This component provides client-side enhancements that are not critical for SSR
// It includes features like analytics, interactive elements, etc.
function ClientOnlyEnhancements() {
    useEffect(() => {
        // Add any global client-side enhancements here
        
        // Example: Initialize analytics
        if (typeof window !== 'undefined') {
            // Analytics initialization
            console.log('Client-side enhancements loaded');
        }

        // Example: Add keyboard navigation enhancements
        const handleKeyboardNavigation = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                // Close any open modals or dropdowns
                const openDropdowns = document.querySelectorAll('[data-dropdown-open]');
                openDropdowns.forEach(dropdown => {
                    dropdown.removeAttribute('data-dropdown-open');
                });
            }
        };

        document.addEventListener('keydown', handleKeyboardNavigation);

        // Example: Add focus management for accessibility
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('[data-modal]');
        
        if (modal) {
            const firstFocusableElement = modal.querySelector(focusableElements) as HTMLElement;
            const focusableContent = modal.querySelectorAll(focusableElements);
            const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement;

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement?.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement?.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }

        return () => {
            document.removeEventListener('keydown', handleKeyboardNavigation);
        };
    }, []);

    // This component doesn't render anything visible
    // It only provides JavaScript enhancements
    return null;
}

export default ClientOnlyEnhancements;
