"use client";

import React, { useRef, useLayoutEffect } from 'react';

interface TipTapContentBlockProps {
  content: string;
  className?: string;
}

/**
 * A component specifically designed to handle TipTap content blocks
 * with proper spacing for empty paragraphs
 */
export function TipTapContentBlock({ content, className = "" }: TipTapContentBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Using layoutEffect to process DOM before paint
  useLayoutEffect(() => {
    if (contentRef.current) {
      // Process paragraphs to ensure proper spacing
      const paragraphs = contentRef.current.querySelectorAll('p');
      
      paragraphs.forEach((p, index) => {
        // Check if paragraph is empty or just contains non-breaking space
        const isEmpty = 
          p.innerHTML.trim() === '' || 
          p.innerHTML === '&nbsp;' || 
          p.textContent?.trim() === '' ||
          p.childNodes.length === 0 ||
          (p.childNodes.length === 1 && p.firstChild?.nodeName === 'BR');
        
        if (isEmpty) {
          // Ensure proper styling
          p.classList.add('empty-paragraph');
          p.style.minHeight = '1.5rem';
          p.style.marginTop = '1rem';
          p.style.marginBottom = '1rem';
          p.style.display = 'block';
          
          // Make sure there's content to maintain the height
          if (p.innerHTML.trim() === '') {
            p.innerHTML = '&nbsp;';
          }
        }
      });
    }
  }, [content]);
  
  return (
    <div 
      ref={contentRef} 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
