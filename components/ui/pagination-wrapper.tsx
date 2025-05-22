"use client"

import React from 'react';
import { Pagination } from './pagination';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  baseUrl: string;
}

export function PaginationWrapper({ 
  currentPage, 
  totalPages,
  className = "",
  baseUrl
}: PaginationWrapperProps) {
  const linkBuilder = (page: number) => `${baseUrl}?page=${page}`;
  
  return (
    <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      className={className}
      linkBuilder={linkBuilder}
    />
  );
}
