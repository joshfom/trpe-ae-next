import Image from 'next/image';
import Link from 'next/link';

interface LuxeNewsCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  imageUrl: string;
  author: string;
}

export function LuxeNewsCard({
  title,
  excerpt,
  category,
  readTime,
  date,
  imageUrl,
  author
}: LuxeNewsCardProps) {
  return (
    <article className="bg-white  overflow-hidden ">
      {/* Image */}
    <div className="relative h-64 overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
      
      {/* Content */}
      <div className="py-4">
        {/* Category */}
        <div className="text-sm text-amber-600 font-medium mb-2 uppercase tracking-wide">
          {category}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-playfair font-semibold text-slate-900 mb-3 line-clamp-2 leading-tight">
          <Link href={`/luxe/insights/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>{author}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
          <span>{readTime}</span>
        </div>
      </div>
    </article>
  );
}
