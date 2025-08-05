"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MobileFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

export function MobileFormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  value = '',
  onChange,
  error,
  className
}: MobileFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setHasValue(!!newValue);
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputProps = {
    ref: inputRef as any,
    name,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder: isFocused ? placeholder : '',
    required,
    className: cn(
      "w-full px-4 py-4 text-base border-2 rounded-lg transition-all duration-200",
      "focus:outline-none focus:ring-0",
      "bg-white",
      error 
        ? "border-red-300 focus:border-red-500" 
        : isFocused 
          ? "border-blue-500" 
          : hasValue 
            ? "border-gray-300" 
            : "border-gray-200",
      // Ensure minimum touch target size (44px)
      "min-h-[44px]",
      className
    ),
    // Mobile-specific attributes
    autoComplete: getAutoComplete(type, name),
    inputMode: getInputMode(type),
    ...(type === 'tel' && { pattern: '[0-9]*' })
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows={4}
            className={cn(inputProps.className, "resize-none")}
          />
        );
      
      case 'select':
        return (
          <select {...inputProps}>
            <option value="" disabled>
              {placeholder || `Select ${label}`}
            </option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return <input {...inputProps} type={type} />;
    }
  };

  return (
    <div className="relative mb-6">
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={cn(
          "absolute left-4 transition-all duration-200 pointer-events-none",
          "text-gray-500 font-medium",
          isFocused || hasValue
            ? "top-2 text-xs text-blue-600 transform -translate-y-1"
            : "top-4 text-base"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <div className="relative">
        {renderInput()}
        
        {/* Focus Ring for Better Accessibility */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-all duration-200",
            isFocused && "ring-2 ring-blue-500 ring-opacity-50"
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

interface MobileFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function MobileForm({
  children,
  onSubmit,
  className,
  title,
  description,
  submitLabel = 'Submit',
  isSubmitting = false
}: MobileFormProps) {
  return (
    <div className={cn("w-full max-w-md mx-auto p-4", className)}>
      {/* Form Header */}
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full py-4 px-6 text-base font-semibold rounded-lg",
            "transition-all duration-200",
            "min-h-[44px]", // Ensure minimum touch target
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
            isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Submitting...
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </div>
  );
}

// Helper functions for mobile optimization
function getAutoComplete(type: string, name: string): string {
  const autoCompleteMap: Record<string, string> = {
    email: 'email',
    tel: 'tel',
    name: 'name',
    'first-name': 'given-name',
    'last-name': 'family-name',
    phone: 'tel',
    mobile: 'tel',
    address: 'street-address',
    city: 'address-level2',
    country: 'country-name',
    'postal-code': 'postal-code',
    organization: 'organization',
    'job-title': 'organization-title'
  };

  return autoCompleteMap[name.toLowerCase()] || autoCompleteMap[type] || 'off';
}

function getInputMode(type: string): string {
  const inputModeMap: Record<string, string> = {
    tel: 'tel',
    email: 'email',
    number: 'numeric',
    url: 'url',
    search: 'search'
  };

  return inputModeMap[type] || 'text';
}

// Touch-optimized button component
interface MobileTouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function MobileTouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className
}: MobileTouchButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-semibold rounded-lg",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-opacity-50",
    "active:scale-95", // Subtle press feedback
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[48px]"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
}

export default MobileForm;