"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";

// Animation variants for consistency
const fadeInUp = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
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

interface LuxeBlogCardProps {
  post: BlogPost;
  index: number;
  animationDelay?: number;
}

export const LuxeBlogCard = ({ post, index, animationDelay = 0.1 }: LuxeBlogCardProps) => {
  return (
    <motion.article
      className="group cursor-pointer"
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * animationDelay }}
    >
      <Link href={`/luxe/journals/${post.slug}`} className="block">
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
              className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-700 transition-colors"
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

export default LuxeBlogCard;
