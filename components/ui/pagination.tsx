"use client"

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
  linkBuilder?: (page: number) => string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "", 
  linkBuilder 
}: PaginationProps) {
  const renderPageButtons = () => {
    const pages = [];
    
    pages.push(1);

    console.log('Current Page:', currentPage);
    console.log('Total Pages:', totalPages);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    } else if (currentPage >= totalPages - 3) {
      startPage = Math.max(2, totalPages - 4);
    }
    
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages.map((page, index) => {
      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
        return (
          <li key={`ellipsis-${index}`} className="px-3 py-2">
            &#8230;
          </li>
        );
      }
      
      const isActive = page === currentPage;
      
      if (linkBuilder) {
        return (
          <li key={page}>
            <Link
              href={linkBuilder(page as number)}
              className={`px-3 py-2 rounded-md ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
            >
              {page}
            </Link>
          </li>
        );
      }
      
      return (
        <li key={page}>
          <button
            onClick={() => onPageChange?.(page as number)}
            className={`px-3 py-2 rounded-md ${
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            {page}
          </button>
        </li>
      );
    });
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={cn("flex justify-center items-center", className)}>
      <ul className="flex items-center space-x-2">
        <li>
          {linkBuilder ? (
            <Link
              href={currentPage > 1 ? linkBuilder(currentPage - 1) : '#'}
              className={`px-3 py-2 rounded-md hover:bg-muted ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous page</span>
            </Link>
          ) : (
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              className="px-3 py-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous page</span>
            </button>
          )}
        </li>
        
        {renderPageButtons()}
        
        <li>
          {linkBuilder ? (
            <Link
              href={currentPage < totalPages ? linkBuilder(currentPage + 1) : '#'}
              className={`px-3 py-2 rounded-md hover:bg-muted ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next page</span>
            </Link>
          ) : (
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              className="px-3 py-2 rounded-md hover:bg-muted"
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next page</span>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
