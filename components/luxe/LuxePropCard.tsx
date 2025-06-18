import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LuxePropCardProps {
  id?: string;
  title?: string;
  location?: string;
  price?: number;
  currency?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  imageUrl?: string;
  rating?: number;
  className?: string;
}

export default function LuxePropCard({
  id,
  title = "West Square Villa",
  location = "Jumeirah Village Triangle",
  price = 230000,
  currency = "AED",
  beds = 5,
  baths = 7,
  sqft = 9780,
  imageUrl = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating = 5,
  className = ""
}: LuxePropCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toString();
  };

  const formatSqft = (sqft: number) => {
    return sqft.toLocaleString();
  };

  return (
    <div className={cn("bg-white overflow-hidden transition-transform transform hover:scale-105", className)}>
      {/* Property Image */}
    <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Title and Location */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-1">
            {location}
          </p>
        </div>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  index < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-lg sm:text-2xl font-bold text-gray-900">
              {currency} {formatPrice(price)}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="border-t border-slate-400 pt-3 sm:pt-4">
          <div className="flex items-center justify-between text-gray-700">
            <span className="text-sm sm:text-lg font-medium">
              {beds} beds - {baths} baths - {formatSqft(sqft)} sq. ft.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
