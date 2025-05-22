"use client"

import { useEffect, useRef } from 'react';

interface TipTapViewProps {
    content: string;
}

export const TipTapView = ({ content }: TipTapViewProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Process the content when it changes
    useEffect(() => {
        if (contentRef.current) {
            // Add <br> elements to empty paragraphs to maintain spacing
            const emptyParagraphs = contentRef.current.querySelectorAll('p:empty');
            emptyParagraphs.forEach(p => {
                const br = document.createElement('br');
                br.className = 'ProseMirror-trailingBreak';
                p.appendChild(br);
            });
            
            // Process links: remove rel for internal links, add nofollow for external
            const links = contentRef.current.querySelectorAll('a[href]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    try {
                        const url = new URL(href, window.location.origin);
                        // Check if it's an internal link (trpe.ae domain)
                        if (url.hostname.includes('trpe.ae')) {
                            // Internal link: remove rel attribute completely
                            link.removeAttribute('rel');
                        } else {
                            // External link: ensure it has nofollow
                            const currentRel = link.getAttribute('rel') || '';
                            if (!currentRel.includes('nofollow')) {
                                link.setAttribute('rel', currentRel ? `${currentRel} nofollow` : 'nofollow');
                            }
                        }
                    } catch (e) {
                        // If URL parsing fails, it's likely a relative URL (internal)
                        // Treat as internal link and remove rel
                        link.removeAttribute('rel');
                    }
                }
            });
        }
    }, [content]);

    return (
        <div className="rounded-lg overflow-hidden bg-background">
            <div id="tip-tap" className="relative px-4 py-3">
                <div 
                    ref={contentRef}
                    className="prose prose-sm max-w-none prose-headings:mb-3 prose-headings:mt-6 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-3 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80"
                    dangerouslySetInnerHTML={{ __html: content || '' }}
                />
            </div>
        </div>
    );
};