"use client"

import { useRef } from 'react';

interface TipTapViewProps {
    content: string;
    processedContent?: string;
}

export const TipTapView = ({ content, processedContent }: TipTapViewProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Use the pre-processed content if available, otherwise use original content
    const finalContent = processedContent || content;

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