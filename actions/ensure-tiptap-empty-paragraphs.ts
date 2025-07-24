"use server";

/**
 * Utility function to remove empty paragraphs from TipTap content
 * This removes unnecessary spacing from empty paragraphs
 */
export async function ensureProperEmptyParagraphs(content: string): Promise<string> {
  if (!content) return '';
  
  try {
    // 1. Remove completely empty paragraphs
    let processedContent = content.replace(/<p><\/p>/g, '');
    
    // 2. Remove paragraphs with just &nbsp;
    processedContent = processedContent.replace(/<p>&nbsp;<\/p>/g, '');
    
    // 3. Remove paragraphs with just spaces, tabs, or newlines
    processedContent = processedContent.replace(/<p>\s*<\/p>/g, '');
    
    // 4. Remove paragraphs with just <br> tags
    processedContent = processedContent.replace(/<p><br\s*\/?><\/p>/gi, '');
    
    // 5. Remove paragraphs with only whitespace and br tags
    processedContent = processedContent.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '');
    
    // 6. Remove any empty paragraphs with class empty-paragraph
    processedContent = processedContent.replace(/<p[^>]*class[^>]*empty-paragraph[^>]*>.*?<\/p>/gi, '');
    
    // 7. Clean up multiple consecutive line breaks that might result from removal
    processedContent = processedContent.replace(/(\n\s*){3,}/g, '\n\n');
    
    return processedContent.trim();
  } catch (error) {
    console.error("Error processing TipTap empty paragraphs:", error);
    return content;
  }
}
