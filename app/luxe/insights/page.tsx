import { LuxeNewsGrid } from '@/components/luxe/luxe-news-grid';

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Latest News */}
      <section className="relative h-[800px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-playfair text-white mb-8 drop-shadow-lg">
              Latest News
            </h1>
          </div>
        </div>
      </section>


      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair font-light text-slate-900 mb-6">
              Latest News
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest developments, trends, and insights 
              from Dubai&apos;s dynamic luxury real estate market.
            </p>
          </div>

          <LuxeNewsGrid />
        </div>
      </section>
      
    </div>
  );
}
