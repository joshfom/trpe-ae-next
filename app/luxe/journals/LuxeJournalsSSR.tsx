import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from "lucide-react";

interface Insight {
  id: string;
  title: string | null;
  slug: string;
  coverUrl: string | null;
  content: string | null;
  altText: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  authorId: string | null;
  author?: {
    id: string;
    name: string | null;
    about: string | null;
    avatar: string | null;
  } | null;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  slug: string;
  category: string;
}

interface LuxeJournalsSSRProps {
  insights: Insight[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// SSR-compatible Blog Card Component - Exact same design as original
const LuxeBlogCardSSR: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
  return (
    <article className="group cursor-pointer">
      <Link href={`/luxe/journals/${post.slug}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-800 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{ backgroundImage: `url("${post.imageUrl}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="py-6 sm:py-8 px-4 sm:px-6">
            {/* Meta Information */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 mb-6">
              {post.excerpt}
            </p>

            {/* Read More Link */}
            <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
              <span>Read More</span>
              <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

const LuxeJournalsSSR: React.FC<LuxeJournalsSSRProps> = ({ insights, pagination }) => {
  // Helper function to extract excerpt from content
  const getExcerpt = (content: string | null, maxLength: number = 150): string => {
    if (!content) return "Discover the latest journals from Dubai's luxury real estate market.";
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    return plainText.substring(0, maxLength).trim() + '...';
  };

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Transform journals to BlogPost format for consistency with LuxeBlogCard
  const transformedPosts: BlogPost[] = insights.map((insight) => ({
    id: insight.id,
    title: insight.title || 'Untitled',
    excerpt: getExcerpt(insight.content),
    author: insight.author?.name || 'TRPE Luxe Team',
    date: formatDate(insight.publishedAt || insight.createdAt),
    imageUrl: insight.coverUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: insight.slug,
    category: 'Luxury Journals'
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Exact same as original */}
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-playfair text-white mb-4 sm:mb-6 drop-shadow-lg leading-tight">
              Luxe Journals
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Exclusive journals and trends from Dubai&apos;s luxury real estate market
            </p>
          </div>
        </div>
      </section>

      {/* Insights Section - Exact same as original */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-slate-900 mb-4 sm:mb-6">
              Latest Journals
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {insights.length > 0 
                ? `Discover ${pagination.total} exclusive journals from Dubai's luxury real estate experts.`
                : 'Stay tuned for exclusive journals from Dubai\'s luxury real estate market.'
              }
            </p>
          </div>

          {/* Insights Grid - Exact same as original */}
          {transformedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
              {transformedPosts.map((post, index) => (
                <LuxeBlogCardSSR key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No journals available yet</h3>
              <p className="text-gray-500">Check back soon for the latest luxury real estate journals.</p>
            </div>
          )}

          {/* Pagination - Exact same as original but with working links */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Button */}
              {pagination.hasPrevPage ? (
                <Link
                  href={`?page=${pagination.currentPage - 1}`}
                  className="px-4 py-2 rounded-lg transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                >
                  Previous
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-lg transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Previous
                </button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`?page=${page}`}
                  className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                    pagination.currentPage === page
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </Link>
              ))}

              {/* Next Button */}
              {pagination.hasNextPage ? (
                <Link
                  href={`?page=${pagination.currentPage + 1}`}
                  className="px-4 py-2 rounded-lg transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                >
                  Next
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-lg transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LuxeJournalsSSR;
