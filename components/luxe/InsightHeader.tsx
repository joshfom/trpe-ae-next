import Image from 'next/image';
import { Insight } from '@/types/insight';

interface InsightHeaderProps {
  insight: Insight;
}

export function InsightHeader({ insight }: InsightHeaderProps) {
  return (
    <div>
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={insight.imageUrl}
          alt={insight.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 sm:bg-black/20" />
      </div>

      {/* Content Overlay */}
      {/* <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 sm:mb-6 leading-tight px-2">
            {insight.title}
          </h1>
        </div>
      </div> */}
    </div>
    <div className='py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <h1 className="text-2xl sm:text-3xl md:text-4xl  font-light  mb-4 sm:mb-6 leading-tight px-2">
        {insight.title}
      </h1>
    </div>
    </div>
  );
}
