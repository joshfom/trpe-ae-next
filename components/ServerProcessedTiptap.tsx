import { processHtmlContent } from '../actions/process-html-content';
import { TipTapView } from './TiptapView';

interface ServerProcessedTiptapProps {
    content?: string;
}

/**
 * Server Component that pre-processes HTML content before rendering it with TiptapView
 * This handles adding rel="follow" to internal links and rel="nofollow" to external links
 * as well as other HTML processing that should happen on the server
 */
export async function ServerProcessedTiptap({ content = '' }: ServerProcessedTiptapProps) {
  try {
    // Process the HTML content on the server
    const processedContent = await processHtmlContent(content);
    
    // Pass both the original and processed content to the client component
    return <TipTapView content={content} processedContent={processedContent} />;
  } catch (error) {
    console.error("Error in ServerProcessedTiptap:", error);
    // Fallback to rendering the original content if there's an error
    return <TipTapView content={content} />;
  }
}
