import { notFound } from 'next/navigation';
import { InsightHeader } from '@/components/luxe/InsightHeader';
import { InsightContent } from '@/components/luxe/InsightContent';
import { InsightSidebar } from '@/components/luxe/InsightSidebar';
import { Insight } from '@/types/insight';
import { getLuxeInsightBySlugAction } from '@/actions/insights/get-luxe-insight-by-slug-action';

// Transform database insight to UI format
const transformInsightData = (dbInsight: any): Insight => {
  // Calculate reading time based on content length
  const calculateReadingTime = (content: string | null): string => {
    if (!content) return '3 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Extract excerpt from content
  const getExcerpt = (content: string | null, metaDescription: string | null): string => {
    if (metaDescription) return metaDescription;
    if (!content) return 'Discover the latest insights from Dubai\'s luxury real estate market.';
    
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 150 ? plainText.substring(0, 150).trim() + '...' : plainText;
  };

  return {
    id: dbInsight.id,
    title: dbInsight.title || 'Untitled',
    content: dbInsight.content || '',
    excerpt: getExcerpt(dbInsight.content, dbInsight.metaDescription),
    imageUrl: dbInsight.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: formatDate(dbInsight.publishedAt || dbInsight.createdAt),
    category: 'Luxury Insights',
    readingTime: calculateReadingTime(dbInsight.content),
    author: {
      name: 'TRPE Luxe Team',
      title: 'Luxury Real Estate Specialists',
      avatar: '/assets/images/defaults/agent.jpg'
    },
    slug: dbInsight.slug
  };
};

const getInsightBySlug = async (slug: string): Promise<Insight | null> => {
  const result = await getLuxeInsightBySlugAction(slug);
  
  if (!result.success || !result.data) {
    return null;
  }
  
  return transformInsightData(result.data);
};

interface InsightDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <InsightHeader insight={insight} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Sidebar - Mobile First (shows on top on mobile) */}
          <div className="lg:col-span-1 lg:order-1">
            <div className="lg:sticky lg:top-12">
              <InsightSidebar insight={insight} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 lg:order-2">
            <InsightContent insight={insight} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    // Generate on-demand for better performance with dynamic content
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: InsightDetailPageProps) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    return {
      title: 'Insight Not Found',
    };
  }

  return {
    title: insight.title,
    description: insight.excerpt,
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      images: [insight.imageUrl],
    },
  };
}
