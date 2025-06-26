"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";

// Animation variants following the main page pattern
const fadeInUp = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

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

interface LuxeBlogSectionProps {
  posts?: BlogPost[];
  title?: string;
  subtitle?: string;
  showAllLink?: boolean;
  maxPosts?: number;
}

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Luxury Real Estate in Dubai",
    excerpt: "Discover the emerging trends and innovations shaping Dubai's luxury property market, from sustainable developments to smart home technologies.",
    author: "Sarah Johnson",
    date: "December 15, 2024",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    slug: "future-luxury-real-estate-dubai",
    category: "Market Trends"
  },
  {
    id: "2",
    title: "Investment Opportunities in Prime Locations",
    excerpt: "Explore the most promising investment opportunities in Dubai's prime real estate locations, backed by comprehensive market analysis.",
    author: "Michael Chen",
    date: "December 10, 2024",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80",
    slug: "investment-opportunities-prime-locations",
    category: "Investment"
  },
  {
    id: "3",
    title: "Luxury Amenities That Define Modern Living",
    excerpt: "From infinity pools to private elevators, discover the luxury amenities that are setting new standards in high-end residential developments.",
    author: "Emma Rodriguez",
    date: "December 5, 2024",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    slug: "luxury-amenities-modern-living",
    category: "Lifestyle"
  }
];

// Blog Card Component
const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  return (
    <motion.article
      className="group cursor-pointer"
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/insights/${post.slug}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-2">
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${post.imageUrl}")` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
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
            <motion.h3
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {post.title}
            </motion.h3>

            {/* Excerpt */}
            <motion.p
              className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {post.excerpt}
            </motion.p>

            {/* Read More Link */}
            <motion.div
              className="flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span>Read More</span>
              <motion.div
                className="ml-2"
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default function LuxeBlogSection({
  posts = defaultPosts,
  title = "Behind the Keys",
  subtitle = "Stories from those who've lived it, and those who quietly shape it.",
  showAllLink = true,
  maxPosts = 3
}: LuxeBlogSectionProps) {
  const displayPosts = posts.slice(0, maxPosts);

  return (
    <section className="py-6 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            variants={fadeInUp}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 leading-relaxed"
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {displayPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>

        {/* View All Link */}
        {showAllLink && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link
              href="/insights"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              View All Insights
              <motion.div
                className="ml-2"
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Named export for convenience
export { LuxeBlogSection };
