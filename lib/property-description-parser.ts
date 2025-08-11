/**
 * Property Description Parser
 * Converts structured property descriptions from XML feeds into TipTap format
 */

export interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
}

export interface TipTapDocument {
  type: 'doc';
  content: TipTapNode[];
}

/**
 * Parse property description into TipTap format
 * Handles structured content with headers and bullet lists
 */
export function parsePropertyDescription(description: string): TipTapDocument {
  if (!description) {
    return { type: 'doc', content: [] };
  }

  // Split by lines and clean up
  const lines = description
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const content: TipTapNode[] = [];
  let currentParagraphLines: string[] = [];
  let inList = false;
  let currentListItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: currentParagraphLines.join(' ') }]
      });
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      content.push({
        type: 'bulletList',
        content: currentListItems.map(item => ({
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: item }]
          }]
        }))
      });
      currentListItems = [];
    }
  };

  for (const line of lines) {
    // Check if this is a section header (ends with colon)
    const isHeader = line.endsWith(':') && (
      line.toLowerCase().includes('property features') ||
      line.toLowerCase().includes('amenities') ||
      line.toLowerCase().includes('connectivity') ||
      line.toLowerCase().includes('facilities')
    );

    if (isHeader) {
      // Flush any pending content
      flushParagraph();
      flushList();
      
      // Add the header
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: line }]
      });
      
      inList = true;
      continue;
    }
    
    // Check if this is a list item (starts with dash)
    if (line.startsWith('-') && inList) {
      const listItemText = line.substring(1).trim();
      if (listItemText) {
        currentListItems.push(listItemText);
      }
      continue;
    }
    
    // If we were in a list but this line doesn't start with dash, end the list
    if (inList && !line.startsWith('-')) {
      flushList();
      inList = false;
    }
    
    // Regular paragraph content
    if (!inList) {
      currentParagraphLines.push(line);
    }
  }
  
  // Flush any remaining content
  flushParagraph();
  flushList();
  
  return {
    type: 'doc',
    content: content
  };
}

/**
 * Convert TipTap document back to HTML for display
 */
export function tiptapToHtml(doc: TipTapDocument): string {
  const nodeToHtml = (node: TipTapNode): string => {
    switch (node.type) {
      case 'doc':
        return node.content?.map(nodeToHtml).join('') || '';
      
      case 'paragraph':
        const paragraphContent = node.content?.map(nodeToHtml).join('') || '';
        return `<p>${paragraphContent}</p>`;
      
      case 'heading':
        const level = node.attrs?.level || 3;
        const headingContent = node.content?.map(nodeToHtml).join('') || '';
        return `<h${level}>${headingContent}</h${level}>`;
      
      case 'bulletList':
        const listContent = node.content?.map(nodeToHtml).join('') || '';
        return `<ul>${listContent}</ul>`;
      
      case 'listItem':
        const itemContent = node.content?.map(nodeToHtml).join('') || '';
        return `<li>${itemContent}</li>`;
      
      case 'text':
        return node.text || '';
      
      default:
        return '';
    }
  };

  return nodeToHtml(doc);
}

/**
 * Extract just the list items from a description for quick access
 */
export function extractFeaturesList(description: string): {
  features: string[];
  connectivity: string[];
} {
  const lines = description.split('\n').map(line => line.trim());
  
  let features: string[] = [];
  let connectivity: string[] = [];
  let currentSection: 'features' | 'connectivity' | 'none' = 'none';
  
  for (const line of lines) {
    if (line.toLowerCase().includes('property features') || line.toLowerCase().includes('amenities')) {
      currentSection = 'features';
      continue;
    }
    
    if (line.toLowerCase().includes('connectivity')) {
      currentSection = 'connectivity';
      continue;
    }
    
    // If we hit a non-list line, reset section
    if (!line.startsWith('-') && line.length > 0 && !line.endsWith(':')) {
      currentSection = 'none';
      continue;
    }
    
    if (line.startsWith('-')) {
      const item = line.substring(1).trim();
      if (currentSection === 'features') {
        features.push(item);
      } else if (currentSection === 'connectivity') {
        connectivity.push(item);
      }
    }
  }
  
  return { features, connectivity };
}

/**
 * Clean and format description for search indexing
 */
export function extractSearchableText(description: string): string {
  return description
    .replace(/Property features & amenities:/gi, '')
    .replace(/Connectivity:/gi, '')
    .replace(/^-\s*/gm, '') // Remove list dashes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
