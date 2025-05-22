import { Metadata } from 'next';
import { getPageMetaByPath } from './page-meta-actions';

export async function getPageMetadata(path: string, defaultMetadata: Metadata = {}): Promise<Metadata> {
  const pageMeta = await getPageMetaByPath(path);
  
  if (!pageMeta) {
    return defaultMetadata;
  }
  
  const metadata: Metadata = {
    ...defaultMetadata,
    title: pageMeta.metaTitle || defaultMetadata.title,
    description: pageMeta.metaDescription || defaultMetadata.description,
    alternates: {
      ...defaultMetadata.alternates,
      canonical: `${process.env.NEXT_PUBLIC_URL}${path}`,
    },
  };
  
  // Add keywords if available
  if (pageMeta.metaKeywords) {
    metadata.keywords = pageMeta.metaKeywords;
  }
  
  // Add robots directives based on noIndex and noFollow settings
  const robotsDirectives: string[] = [];
  if (pageMeta.noIndex) robotsDirectives.push('noindex');
  if (pageMeta.noFollow) robotsDirectives.push('nofollow');
  
  if (robotsDirectives.length > 0) {
    metadata.robots = robotsDirectives.join(', ');
  }
  
  return metadata;
}
