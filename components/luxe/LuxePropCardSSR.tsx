import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface LuxePropCardSSRProps {
  id?: string;
  slug?: string;
  title?: string;
  location?: string;
  price?: number;
  currency?: string;
  beds?: number;
  showPrice?: boolean;
  baths?: number;
  sqft?: number;
  imageUrl?: string;
  rating?: number;
  className?: string;
  status?: "For Sale" | "For Rent" | "Sold";
}

export default function LuxePropCardSSR({
  id,
  slug,
  title = "The Beverly House",
  location = "Beverly Hills, CA",
  price = 290000,
  currency = "AED",
  beds = 3,
  showPrice = true,
  baths = 2,
  sqft = 1500,
  imageUrl = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating = 5,
  className = "",
  status = "For Sale"
}: LuxePropCardSSRProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString();
  };

  const formatSqft = (sqft: number) => {
    return sqft.toLocaleString();
  };

  return (
    <div 
      className={cn("bg-white rounded-3xl overflow-hidden transition-all duration-500 relative group hover:shadow-lg", className)}
    >
      {/* Property Image */}
      <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden rounded-3xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-3xl transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-gray-800 text-sm font-medium">
            {status}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content - No motion animations, always visible */}
      <div className="py-6 px-4">
        {/* Location with Icon */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500" />
          <p className="text-gray-600 text-sm font-medium">
            {location}
          </p>
        </div>
        
        {/* Title */}
        <Link href={`/luxe/property/${slug}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-4 text-gray-600">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{beds}</span>
            <span className="text-xs">beds</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{baths}</span>
            <span className="text-xs">baths</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Square className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{formatSqft(sqft)}</span>
            <span className="text-xs">Sq</span>
          </div>
        </div>

        {/* Price */}
        {showPrice && (
          <div className="font-bold text-gray-900">
            {currency} {formatPrice(price)}
          </div>
        )}
      </div>
    </div>
  );
}
