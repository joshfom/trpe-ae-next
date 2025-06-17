export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-400 text-sm uppercase tracking-wider mb-4">
            MARKET INSIGHTS
          </p>
          <h1 className="text-5xl lg:text-7xl font-playfair font-light mb-8">
            Luxury Real Estate Insights
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest trends, market analysis, and expert insights 
            from Dubai&apos;s luxury real estate market.
          </p>
        </div>
      </section>

      {/* Insights Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-playfair font-light text-slate-900 mb-6">
              Latest Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert analysis and market trends to help you make informed decisions 
              in Dubai&apos;s luxury real estate market.
            </p>
          </div>

          {/* Insights Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Insight cards would go here */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <div className="text-sm text-amber-600 mb-2">Market Analysis</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Coming Soon: Market Insights
                </h3>
                <p className="text-gray-600 mb-4">
                  Expert insights and market analysis will be featured here.
                </p>
                <div className="text-sm text-gray-500">
                  5 min read
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
