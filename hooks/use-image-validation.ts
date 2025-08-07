/**
 * Custom hook for real-time image validation in forms
 * Provides comprehensive validation feedback for image management operations
 */

import React, { useMemo, useCallback } from 'react';
import { 
    EnhancedFileState, 
    ImageValidationResult,
    validateImageCollection,
    validateImageOperationRealTime,
    validateImagesForSubmission
} from '@/lib/image-management-utils';

export interface UseImageValidationOptions {
    minImages?: number;
    maxImages?: number;
    enableRealTimeValidation?: boolean;
}

export interface UseImageValidationReturn {
    validation: ImageValidationResult;
    validateOperation: (operation: 'add' | 'delete' | 'reorder' | 'upload') => ImageValidationResult;
    validateForSubmission: () => ImageValidationResult;
    isValid: boolean;
    hasErrors: boolean;
    hasWarnings: boolean;
    errorMessage: string | null;
    warningMessage: string | null;
    counts: ImageValidationResult['counts'];
}

/**
 * Hook for comprehensive image validation with real-time feedback
 * @param images - Array of EnhancedFileState objects
 * @param options - Validation options
 * @returns Validation state and helper functions
 */
export function useImageValidation(
    images: EnhancedFileState[],
    options: UseImageValidationOptions = {}
): UseImageValidationReturn {
    const {
        minImages = 6,
        maxImages = 20,
        enableRealTimeValidation = true
    } = options;

    // Base validation that runs on every image change
    const validation = useMemo(() => {
        if (!enableRealTimeValidation) {
            return {
                isValid: true,
                errors: [],
                warnings: [],
                counts: {
                    total: images.length,
                    existing: 0,
                    new: 0,
                    deleted: 0,
                    visible: images.length
                }
            };
        }
        
        return validateImageCollection(images, minImages, maxImages);
    }, [images, minImages, maxImages, enableRealTimeValidation]);

    // Validate specific operations
    const validateOperation = useCallback((operation: 'add' | 'delete' | 'reorder' | 'upload') => {
        return validateImageOperationRealTime(images, operation, minImages, maxImages);
    }, [images, minImages, maxImages]);

    // Validate for form submission
    const validateForSubmission = useCallback(() => {
        return validateImagesForSubmission(images, minImages, maxImages);
    }, [images, minImages, maxImages]);

    // Computed properties for easy access
    const isValid = validation.isValid;
    const hasErrors = validation.errors.length > 0;
    const hasWarnings = validation.warnings.length > 0;
    
    // Primary error and warning messages
    const errorMessage = hasErrors ? validation.errors[0] : null;
    const warningMessage = hasWarnings ? validation.warnings[0] : null;

    return {
        validation,
        validateOperation,
        validateForSubmission,
        isValid,
        hasErrors,
        hasWarnings,
        errorMessage,
        warningMessage,
        counts: validation.counts
    };
}

/**
 * Hook for validation messages with formatting
 * @param validation - Validation result
 * @returns Formatted validation messages
 */
export function useImageValidationMessages(validation: ImageValidationResult) {
    const formattedMessages = useMemo(() => {
        const messages = {
            errors: validation.errors,
            warnings: validation.warnings,
            summary: '',
            detailed: ''
        };

        // Create summary message
        if (validation.errors.length > 0) {
            messages.summary = validation.errors[0];
        } else if (validation.warnings.length > 0) {
            messages.summary = validation.warnings[0];
        } else {
            messages.summary = `${validation.counts.visible} images ready`;
        }

        // Create detailed message
        const parts = [];
        if (validation.counts.existing > 0) {
            parts.push(`${validation.counts.existing} existing`);
        }
        if (validation.counts.new > 0) {
            parts.push(`${validation.counts.new} new`);
        }
        if (validation.counts.deleted > 0) {
            parts.push(`${validation.counts.deleted} deleted`);
        }
        
        if (parts.length > 0) {
            messages.detailed = `Total: ${validation.counts.visible} visible (${parts.join(', ')})`;
        } else {
            messages.detailed = `${validation.counts.visible} images`;
        }

        return messages;
    }, [validation]);

    return formattedMessages;
}

/**
 * Hook for validation state with debounced updates
 * Useful for preventing excessive validation during rapid operations
 * @param images - Array of EnhancedFileState objects
 * @param options - Validation options
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Debounced validation state
 */
export function useDebouncedImageValidation(
    images: EnhancedFileState[],
    options: UseImageValidationOptions = {},
    debounceMs: number = 300
): UseImageValidationReturn {
    const [debouncedImages, setDebouncedImages] = React.useState(images);

    // Debounce image updates
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedImages(images);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [images, debounceMs]);

    return useImageValidation(debouncedImages, options);
}