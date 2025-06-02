"use server";

/**
 * Utility function to ensure TipTap content has properly formed empty paragraphs
 * This should be used before saving content to ensure consistent rendering
 */
export async function ensureProperEmptyParagraphs(content: string): Promise<string> {
  if (!content) return '';
  
  try {
    // 1. Handle completely empty paragraphs
    let processedContent = content.replace(/<p><\/p>/g, '<p class="empty-paragraph">&nbsp;</p>');
    
    // 2. Handle paragraphs with just &nbsp;
    processedContent = processedContent.replace(/<p>&nbsp;<\/p>/g, '<p class="empty-paragraph">&nbsp;</p>');
    
    // 3. Handle paragraphs with just spaces or newlines
    processedContent = processedContent.replace(/<p>\s*<\/p>/g, '<p class="empty-paragraph">&nbsp;</p>');
    
    return processedContent;
  } catch (error) {
    console.error("Error processing TipTap empty paragraphs:", error);
    return content;
  }
}
