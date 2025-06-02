"use client"

import { useRef, useEffect } from 'react';
import styles from './TiptapView.module.css';

interface TipTapViewSpacedProps {
    content: string;
    processedContent?: string;
}

export const TipTapViewSpaced = ({ content, processedContent }: TipTapViewSpacedProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Use the pre-processed content if available, otherwise use original content
    const finalContent = processedContent || content;
    
    // Add effect to ensure empty paragraphs have proper spacing
    useEffect(() => {
        if (contentRef.current) {
            // Fix empty paragraphs
            const emptyParagraphs = contentRef.current.querySelectorAll('p');
            emptyParagraphs.forEach((p) => {
                // If the paragraph is empty or just contains &nbsp; or whitespace
                if (p.innerHTML.trim() === '' || p.innerHTML === '&nbsp;' || p.textContent?.trim() === '') {
                    p.classList.add(styles.emptyParagraph);
                    
                    // Ensure there's content for spacing
                    if (p.innerHTML.trim() === '') {
                        p.innerHTML = '&nbsp;';
                    }
                }
            });
        }
    }, [finalContent]);

    return (
        <div className="rounded-lg overflow-hidden bg-background">
            <div id="tip-tap" className="relative px-4 py-3">
                <div 
                    ref={contentRef}
                    className={`prose prose-sm max-w-none focus:outline-hidden prose-headings:mb-3 prose-headings:mt-6 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic ${styles.tiptapContainer}`}
                    dangerouslySetInnerHTML={{ __html: finalContent }}
                />
            </div>
        </div>
    );
};
