"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LuxeBlogCard } from "./LuxeBlogCard";

// Animation variants following the main page pattern
const fadeInUp = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
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
    author: "TRPE Luxe Team",
    date: "December 15, 2024",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    slug: "future-luxury-real-estate-dubai",
    category: "Market Trends"
  },
  {
    id: "2",
    title: "Investment Opportunities in Prime Locations",
    excerpt: "Explore the most promising investment opportunities in Dubai's prime real estate locations, backed by comprehensive market analysis.",
    author: "TRPE Luxe Team",
    date: "December 10, 2024",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80",
    slug: "investment-opportunities-prime-locations",
    category: "Investment"
  },
  {
    id: "3",
    title: "Luxury Amenities That Define Modern Living",
    excerpt: "From infinity pools to private elevators, discover the luxury amenities that are setting new standards in high-end residential developments.",
    author: "TRPE Luxe Team",
    date: "December 5, 2024",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    slug: "luxury-amenities-modern-living",
    category: "Lifestyle"
  }
];

export default function LuxeBlogSection({
  posts,
  title = "Behind the Keys",
  subtitle = "Stories from those who've lived it, and those who quietly shape it.",
  showAllLink = true,
  maxPosts = 3
}: LuxeBlogSectionProps) {
  // Use provided posts or fall back to default posts if none provided
  const displayPosts = posts && posts.length > 0 ? posts.slice(0, maxPosts) : defaultPosts.slice(0, maxPosts);

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
            <LuxeBlogCard key={post.id} post={post} index={index} />
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
              href="/luxe/journals"
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
