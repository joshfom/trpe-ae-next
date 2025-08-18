"use client"

import {motion} from "framer-motion";
import {LuxeBlogCard} from "@/components/luxe/LuxeBlogCard";

// Faster animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

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

interface LuxeJournalsClientProps {
  insights: Insight[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const LuxeJournalsClient: React.FC<LuxeJournalsClientProps> = ({ insights, pagination }) => {
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
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
          }}
          variants={fadeInScale}
        >
          {/* Overlay for text readability */}
          <motion.div 
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-playfair text-white mb-4 sm:mb-6 drop-shadow-lg leading-tight"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.01 }}
            >
              Luxe Journals
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Exclusive journals and trends from Dubai&apos;s luxury real estate market
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Insights Section */}
      <motion.section 
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px", amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-slate-900 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Latest Journals
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {insights.length > 0 
                ? `Discover ${pagination.total} exclusive journals from Dubai's luxury real estate experts.`
                : 'Stay tuned for exclusive journals from Dubai\'s luxury real estate market.'
              }
            </motion.p>
          </motion.div>

          {/* Insights Grid */}
          {transformedPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {transformedPosts.map((post, index) => (
                <LuxeBlogCard key={post.id} post={post} index={index} animationDelay={0.08} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No journals available yet</h3>
              <p className="text-gray-500">Check back soon for the latest luxury real estate journals.</p>
            </motion.div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Previous Button */}
              <button
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !pagination.hasPrevPage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    pagination.currentPage === page
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !pagination.hasNextPage
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default LuxeJournalsClient;
