import React from 'react';
import '../app/empty-para.css';

interface TipTapViewServerProps {
    content: string;
    processedContent?: string;
}

// Server-side version of TipTapView for SSR compatibility
export const TipTapViewServer = ({ content, processedContent }: TipTapViewServerProps) => {
    // Use the pre-processed content if available, otherwise use original content
    const finalContent = processedContent || content;
    
    // Server-side content processing for empty paragraphs
    const processContentForServer = (htmlContent: string): string => {
        // Replace empty paragraphs with properly spaced ones
        return htmlContent
            .replace(/<p><\/p>/g, '<p class="empty-paragraph">&nbsp;</p>')
            .replace(/<p>\s*<\/p>/g, '<p class="empty-paragraph">&nbsp;</p>')
            .replace(/<p>&nbsp;<\/p>/g, '<p class="empty-paragraph">&nbsp;</p>');
    };

    const processedServerContent = processContentForServer(finalContent);

    return (
        <div className="rounded-lg overflow-hidden bg-background">
            <div id="tip-tap" className="relative px-4 py-3">
                <div 
                    className="prose prose-sm max-w-none focus:outline-hidden prose-headings:mb-3 prose-headings:mt-6 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic"
                    dangerouslySetInnerHTML={{ __html: processedServerContent }}
                />
            </div>
        </div>
    );
};