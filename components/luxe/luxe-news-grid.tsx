'use client';

import { useState } from 'react';
import { LuxeNewsCard } from './luxe-news-card';

// Mock data for demonstration
const mockNews = [
  {
    id: 1,
    title: "Dubai's Luxury Real Estate Market Reaches New Heights in 2025",
    excerpt: "The luxury property market in Dubai continues to show remarkable growth, with prime locations seeing unprecedented demand from international investors.",
    category: "Market Analysis",
    readTime: "5 min read",
    date: "June 15, 2025",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 2,
    title: "Palm Jumeirah Villas: Investment Opportunities in Paradise",
    excerpt: "Exclusive beachfront villas on Palm Jumeirah offer unparalleled luxury living and exceptional investment returns for discerning buyers.",
    category: "Investment",
    readTime: "7 min read",
    date: "June 12, 2025",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 3,
    title: "Sustainable Luxury: Green Building Trends in Dubai",
    excerpt: "Dubai's commitment to sustainability is reshaping luxury real estate, with eco-friendly developments leading the market transformation.",
    category: "Sustainability",
    readTime: "6 min read",
    date: "June 10, 2025",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 4,
    title: "Downtown Dubai Penthouses: The Ultimate Urban Luxury",
    excerpt: "Discover the most exclusive penthouses in Downtown Dubai, offering breathtaking views and world-class amenities in the heart of the city.",
    category: "Luxury Living",
    readTime: "8 min read",
    date: "June 8, 2025",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 5,
    title: "Dubai Marina: Waterfront Living Redefined",
    excerpt: "The Dubai Marina district continues to evolve, offering sophisticated waterfront living with stunning architecture and premium amenities.",
    category: "Location Spotlight",
    readTime: "5 min read",
    date: "June 5, 2025",
    imageUrl: "https://images.unsplash.com/photo-1722502831583-b4e93ecc6027?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "TRPE Luxe Team"
  },
  {
    id: 6,
    title: "Smart Homes: Technology Meets Luxury in Dubai",
    excerpt: "The integration of cutting-edge technology in luxury homes is transforming the way residents experience comfort and convenience.",
    category: "Technology",
    readTime: "6 min read",
    date: "June 3, 2025",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 7,
    title: "Expo 2020 Legacy: New Developments Shaping Dubai's Future",
    excerpt: "The lasting impact of Expo 2020 continues to influence new luxury developments across Dubai, creating innovative living spaces.",
    category: "Development",
    readTime: "7 min read",
    date: "June 1, 2025",
    imageUrl: "https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 8,
    title: "Off-Plan Investments: Timing the Dubai Market",
    excerpt: "Strategic insights into off-plan property investments and how to maximize returns in Dubai's dynamic real estate landscape.",
    category: "Investment Strategy",
    readTime: "9 min read",
    date: "May 30, 2025",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  },
  {
    id: 9,
    title: "Jumeirah Beach Residence: Coastal Luxury Living",
    excerpt: "Explore the sophisticated beachfront lifestyle at JBR, where luxury meets the pristine shores of the Arabian Gulf.",
    category: "Lifestyle",
    readTime: "6 min read",
    date: "May 28, 2025",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    author: "TRPE Luxe Team"
  }
];

interface LuxeNewsGridProps {
  itemsPerPage?: number;
}

export function LuxeNewsGrid({ itemsPerPage = 9 }: LuxeNewsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(mockNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = mockNews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of news section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentNews.map((news) => (
          <LuxeNewsCard key={news.id} {...news} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
