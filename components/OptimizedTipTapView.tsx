import { processHtmlContent } from '../actions/process-html-content';
import { ensureProperEmptyParagraphs } from '../actions/ensure-tiptap-empty-paragraphs';
import { TipTapContentBlock } from './TipTapContentBlock';

interface OptimizedTipTapViewProps {
    content: string;
}

/**
 * An optimized TipTap view component that ensures proper empty paragraph spacing
 * Uses both server-side processing and client-side optimization
 */
export async function OptimizedTipTapView({ content }: OptimizedTipTapViewProps) {
  if (!content) return null;
  
  try {
    // First ensure proper empty paragraph structure
    const withProperParagraphs = await ensureProperEmptyParagraphs(content);
    
    // Then process all HTML content (links, etc)
    const processedContent = await processHtmlContent(withProperParagraphs);
    
    return (
      <div className="rounded-lg overflow-hidden bg-background">
        <div id="tip-tap" className="relative px-4 py-3">
          <TipTapContentBlock 
            content={processedContent} 
            className="prose-headings:mb-2 prose-headings:mt-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-1 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic" 
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in OptimizedTipTapView:", error);
    
    // Fallback to simple rendering if processing fails
    return (
      <div className="rounded-lg overflow-hidden bg-background">
        <div id="tip-tap" className="relative px-4 py-3">
          <div 
            className="prose prose-sm max-w-none prose-headings:mb-2 prose-headings:mt-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-p:my-1"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    );
  }
}
