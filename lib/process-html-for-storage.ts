"use server"

/**
 * Utility function to process HTML content before storing it in the database.
 * This ensures that links already have the correct rel attributes without requiring
 * client-side or server-side DOM parsing later.
 * 
 * @param htmlContent The HTML content to process
 * @returns Processed HTML content with proper rel attributes
 */
export async function processHtmlForStorage(htmlContent: string): Promise<string> {
  if (!htmlContent) return '';
  
  try {
    // Add <br> elements to empty paragraphs
    htmlContent = htmlContent.replace(/<p><\/p>/g, '<p><br class="ProseMirror-trailingBreak"></p>');
    
    // Process links using regex
    return htmlContent.replace(/<a\s+([^>]*?)href=(['"])([^'"]*?)(['"])([^>]*?)>/g, (match, before, quoteStart, href, quoteEnd, after) => {
      // Check if it's an internal link
      const isInternalLink = (() => {
        // Check for relative URLs (start with /, #, or no protocol)
        if (href.startsWith('/') || href.startsWith('#') || href.startsWith('?')) {
          return true;
        }
        
        // Check for relative URLs without leading slash
        if (!href.includes('://') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          return true;
        }
        
        try {
          const url = new URL(href);
          
          // Check if it's trpe.ae domain (exact match or subdomain)
          return url.hostname === 'trpe.ae' || 
                url.hostname.endsWith('.trpe.ae');
        } catch (e) {
          // If URL parsing fails, treat as internal (likely relative)
          return true;
        }
      })();
      
      // Extract existing rel attribute if it exists
      const relMatch = (before + ' ' + after).match(/rel=(['"])(.*?)(['"])/);
      let relAttr = relMatch ? relMatch[2] : '';
      
      if (isInternalLink) {
        // Internal link: add follow if not already present
        if (!relAttr.includes('follow')) {
          relAttr = relAttr ? `${relAttr} follow` : 'follow';
        }
      } else {
        // External link: add nofollow if not already present
        if (!relAttr.includes('nofollow')) {
          relAttr = relAttr ? `${relAttr} nofollow` : 'nofollow';
        }
      }
      
      // Add target="_blank" unless it's already defined
      const hasTarget = (before + ' ' + after).includes('target=');
      const targetAttr = hasTarget ? '' : ' target="_blank"';
      
      // Check if class attribute exists
      const classMatch = (before + ' ' + after).match(/class=(['"])(.*?)(['"])/);
      let classAttr = classMatch ? classMatch[2] : '';
      
      // Add our styling classes if not already present
      const linkClasses = 'text-primary underline underline-offset-4 hover:text-primary/80';
      if (!classAttr.includes(linkClasses)) {
        classAttr = classAttr ? `${classAttr} ${linkClasses}` : linkClasses;
      }
      
      // Remove existing class attribute if it exists
      let newBefore = before.replace(/class=(['"])(.*?)(['"])\s*/, '');
      let newAfter = after.replace(/\s*class=(['"])(.*?)(['"])/, '');
      
      // Build the new link tag with our class attribute
      return `<a ${newBefore}href=${quoteStart}${href}${quoteEnd} rel="${relAttr}"${targetAttr} class="${classAttr}"${newAfter}>`;
    });
  } catch (error) {
    console.error("Error processing HTML content for storage:", error);
    // Return the original content in case of any errors
    return htmlContent;
  }
}
