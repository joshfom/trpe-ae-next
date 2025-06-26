import { notFound } from 'next/navigation';
import { InsightHeader } from '@/components/luxe/InsightHeader';
import { InsightContent } from '@/components/luxe/InsightContent';
import { InsightSidebar } from '@/components/luxe/InsightSidebar';
import { Insight } from '@/types/insight';

// Mock data - replace with actual data fetching
const getInsightBySlug = async (slug: string): Promise<Insight | null> => {
  // This would be replaced with actual data fetching
  return {
    id: '1',
    title: 'The name of the blog is here',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.`,
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: 'https://images.unsplash.com/photo-1743819464838-ead29229489e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    date: '1st June 2025',
    category: 'Buying real estate',
    readingTime: '5 Minutes',
    author: {
      name: 'Mohammad Salari',
      title: 'Senior Real Estate Specialist',
      avatar: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    slug
  };
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
