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
      // Process paragraphs to handle empty ones properly
      const paragraphs = contentRef.current.querySelectorAll('p');
      
      paragraphs.forEach((p, index) => {
        // Check if paragraph is empty or just contains whitespace/nbsp/br
        const textContent = p.textContent || '';
        const innerHTML = p.innerHTML.trim();
        
        const isEmpty = 
          innerHTML === '' || 
          innerHTML === '&nbsp;' || 
          innerHTML === '<br>' ||
          innerHTML === '<br/>' ||
          innerHTML === '<br />' ||
          textContent.trim() === '' ||
          p.childNodes.length === 0 ||
          (p.childNodes.length === 1 && p.firstChild?.nodeName === 'BR');
        
        if (isEmpty) {
          // Remove spacing for empty paragraphs
          p.classList.add('empty-paragraph');
          p.style.margin = '0';
          p.style.padding = '0';
          p.style.minHeight = '0';
          p.style.height = '0';
          p.style.lineHeight = '0';
          p.style.display = 'block';
          
          // Remove any content to prevent spacing
          p.innerHTML = '';
          
          // Add a data attribute for CSS targeting
          p.setAttribute('data-empty', 'true');
        } else {
          // Ensure normal paragraphs have proper spacing
          p.classList.remove('empty-paragraph');
          p.removeAttribute('data-empty');
          // Reset inline styles to allow CSS to take over
          p.style.margin = '';
          p.style.padding = '';
          p.style.minHeight = '';
          p.style.height = '';
          p.style.lineHeight = '';
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
