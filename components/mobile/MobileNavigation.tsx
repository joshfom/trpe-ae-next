"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ChevronRight, Home, Search, Building, Users, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  className?: string;
  onNavigate?: (href: string) => void;
}

export function MobileNavigation({ 
  navigationItems, 
  className,
  onNavigate 
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    onNavigate?.(href);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const isActive = isActiveLink(item.href);

    return (
      <div key={item.label} className="w-full">
        <div
          className={cn(
            "flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-200",
            "hover:bg-gray-50 active:bg-gray-100",
            level > 0 && "pl-8",
            isActive && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.label)}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={isExpanded}
              aria-controls={`submenu-${item.label}`}
            >
              <div className="flex items-center space-x-3">
                {item.icon && (
                  <span className="flex-shrink-0 w-5 h-5">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium">{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              onClick={() => handleNavigate(item.href)}
              className="flex items-center space-x-3 w-full"
            >
              {item.icon && (
                <span className="flex-shrink-0 w-5 h-5">
                  {item.icon}
                </span>
              )}
              <span className="font-medium">{item.label}</span>
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div
            id={`submenu-${item.label}`}
            className="bg-gray-50 border-l-2 border-gray-200 ml-4"
          >
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md",
          "bg-white shadow-lg border border-gray-200",
          "hover:bg-gray-50 active:bg-gray-100",
          "transition-colors duration-200",
          className
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        className={cn(
          "lg:hidden fixed top-0 right-0 z-40 h-full w-80 max-w-[85vw]",
          "bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          "overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="py-2">
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500 text-center">
            © 2024 TRPE Global
          </div>
        </div>
      </nav>
    </>
  );
}

// Default navigation items for TRPE
export const defaultNavigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="w-5 h-5" />
  },
  {
    label: 'Properties',
    href: '/properties',
    icon: <Building className="w-5 h-5" />,
    children: [
      { label: 'For Sale', href: '/properties/for-sale' },
      { label: 'For Rent', href: '/properties/for-rent' },
      { label: 'Commercial Sale', href: '/properties/commercial-sale' },
      { label: 'Commercial Rent', href: '/properties/commercial-rent' }
    ]
  },
  {
    label: 'Communities',
    href: '/communities',
    icon: <Search className="w-5 h-5" />
  },
  {
    label: 'Off-Plan',
    href: '/off-plan',
    icon: <Building className="w-5 h-5" />
  },
  {
    label: 'Insights',
    href: '/insights',
    icon: <Search className="w-5 h-5" />
  },
  {
    label: 'Our Team',
    href: '/our-team',
    icon: <Users className="w-5 h-5" />
  },
  {
    label: 'Contact Us',
    href: '/contact-us',
    icon: <Phone className="w-5 h-5" />
  }
];

export default MobileNavigation;