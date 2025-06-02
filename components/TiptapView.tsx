"use client"

import { useRef, useEffect } from 'react';
import '../app/empty-para.css';

interface TipTapViewProps {
    content: string;
    processedContent?: string;
}

export const TipTapView = ({ content, processedContent }: TipTapViewProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Use the pre-processed content if available, otherwise use original content
    const finalContent = processedContent || content;
    
    // Enhanced effect to ensure proper spacing for empty paragraphs
    useEffect(() => {
        if (contentRef.current) {
            // Process all paragraphs
            const allParagraphs = contentRef.current.querySelectorAll('p');
            
            allParagraphs.forEach((p) => {
                // Check for truly empty paragraphs or paragraphs with only whitespace/&nbsp;
                const isEmpty = 
                    p.innerHTML.trim() === '' || 
                    p.innerHTML === '&nbsp;' || 
                    p.textContent?.trim() === '' ||
                    p.innerHTML.includes('ProseMirror-trailingBreak') ||
                    (p.childNodes.length === 1 && p.firstChild?.nodeName === 'BR');
                
                if (isEmpty) {
                    // Add our custom class for empty paragraphs
                    p.classList.add('empty-paragraph');
                    
                    // Make sure there's sufficient content for spacing
                    if (p.innerHTML.trim() === '') {
                        p.innerHTML = '&nbsp;';
                    }
                }
                
                // Special case: Check for paragraphs that might be adjacent to each other
                // If this paragraph and the next one are both empty, add extra margin
                const nextSibling = p.nextElementSibling;
                if (isEmpty && nextSibling?.tagName === 'P' && 
                    (nextSibling.innerHTML.trim() === '' || 
                     nextSibling.innerHTML === '&nbsp;' || 
                     nextSibling.textContent?.trim() === '')) {
                    p.style.marginBottom = '1.5rem';
                }
            });
        }
    }, [finalContent]);

    return (
        <div className="rounded-lg overflow-hidden bg-background">
            <div id="tip-tap" className="relative px-4 py-3">
                <div 
                    ref={contentRef}
                    className="prose prose-sm max-w-none focus:outline-hidden prose-headings:mb-3 prose-headings:mt-6 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic"
                    dangerouslySetInnerHTML={{ __html: finalContent }}
                />
            </div>
        </div>
    );
};