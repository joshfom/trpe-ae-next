import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ListWithUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Sell your property easily on TRPE */}
      <section className="relative bg-gray-50 py-20 lg:py-32 overflow-hidden">
        {/* Background architectural elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-200 to-gray-200 rounded-lg transform rotate-12"></div>
          <div className="absolute bottom-20 right-32 w-48 h-48 bg-gradient-to-br from-gray-300 to-blue-100 rounded-lg transform -rotate-6"></div>
          <div className="absolute top-32 right-48 w-32 h-32 bg-gradient-to-br from-blue-100 to-gray-100 rounded-lg transform rotate-45"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-slate-900 mb-8 leading-tight">
                Sell your property<br />
                easily on TRPE.
              </h1>
              
              <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo 
                viverra maecenas accumsan lacus vel facilisis.
              </p>
              
              <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
                Apply Now
              </button>
            </div>
            
            {/* Right Side - Architectural Visualization */}
            <div className="relative">
              {/* Main building structure */}
              <div className="relative">
                {/* Background buildings */}
                <div className="absolute top-8 right-16 w-32 h-48 bg-gradient-to-b from-gray-200 to-gray-300 opacity-60 rounded-t-lg"></div>
                <div className="absolute top-12 right-32 w-24 h-40 bg-gradient-to-b from-gray-300 to-gray-400 opacity-40 rounded-t-lg"></div>
                
                {/* Main building */}
                <div className="relative w-80 h-64 bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-2xl mx-auto">
                  {/* Building details */}
                  <div className="absolute inset-4">
                    {/* Windows grid */}
                    <div className="grid grid-cols-6 gap-2 h-full">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="bg-blue-100 opacity-60 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Building shadow */}
                  <div className="absolute -bottom-4 left-4 right-4 h-4 bg-gray-300 opacity-30 rounded-full blur-sm"></div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-16 left-8 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg opacity-70 transform rotate-12"></div>
                <div className="absolute bottom-16 left-16 w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg opacity-50 transform -rotate-6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Agencies Section */}
      <section className="bg-slate-900 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">
              Trusted by TRPE leading agencies
            </h2>
          </div>
          
          {/* Logo Placeholders */}
          <div className="flex justify-center items-center space-x-8 lg:space-x-12">
            {Array.from({ length: 5 }).map((_, index) => (
              <div 
                key={index}
                className="w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-lg flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Communities Section */}
      <section className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-slate-900 mb-4">
              Luxury Communities
            </h2>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-4">
                #2
              </div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs mx-auto">
                Luxury property marketplace in the Middle East
              </p>
            </div>
            
            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-4">
                +7
              </div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs mx-auto">
                Years in the Dubai real estate market
              </p>
            </div>
            
            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-4">
                2M
              </div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs mx-auto">
                Users per year in our digital platform
              </p>
            </div>
            
            {/* Stat 4 */}
            <div className="text-center">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-4">
                10x
              </div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs mx-auto">
                Listing exposure
              </p>
            </div>
            
            {/* Stat 5 */}
            <div className="text-center">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-4">
                25M
              </div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs mx-auto">
                Average property value (AED)
              </p>
            </div>
            
            {/* Stat 6 */}
            <div className="text-center">
              <div className="text-6xl lg:text-7xl xl:text-8xl font-light text-slate-900 mb-4">
                40M
              </div>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-xs mx-auto">
                Average lead value for sales (AED)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why List Section */}
      <section className="relative bg-gradient-to-br from-cyan-400 via-teal-400 to-orange-200 py-20 lg:py-32 min-h-[600px] overflow-hidden">
        {/* Background Dubai Skyline */}
        <div className="absolute bottom-0 right-0 w-full h-full">
          {/* Burj Al Arab inspired structure */}
          <div className="absolute bottom-0 right-32 w-16 h-48 lg:w-20 lg:h-60">
            {/* Main sail structure */}
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-white/80 to-white/60 transform skew-x-12 rounded-t-full shadow-lg"></div>
            {/* Structural lines */}
            <div className="absolute bottom-0 right-2 w-px h-full bg-white/40"></div>
            <div className="absolute bottom-0 right-4 w-px h-3/4 bg-white/30"></div>
            <div className="absolute bottom-0 right-6 w-px h-1/2 bg-white/30"></div>
          </div>
          
          {/* Additional buildings */}
          <div className="absolute bottom-0 right-52 w-12 h-32 lg:w-16 lg:h-40 bg-gradient-to-t from-white/60 to-white/40 rounded-t-lg shadow-md"></div>
          <div className="absolute bottom-0 right-64 w-8 h-24 lg:w-10 lg:h-32 bg-gradient-to-t from-white/50 to-white/30 rounded-t-lg shadow-sm"></div>
          <div className="absolute bottom-0 right-76 w-6 h-20 lg:w-8 lg:h-28 bg-gradient-to-t from-white/40 to-white/20 rounded-t-lg"></div>
          
          {/* Palm/beach structure */}
          <div className="absolute bottom-0 right-96 w-20 h-16 lg:w-24 lg:h-20 bg-gradient-to-t from-orange-300/60 to-orange-200/40 rounded-t-3xl shadow-sm"></div>
          
          {/* Water reflection effect */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyan-500/30 to-transparent"></div>
          
          {/* Floating elements for atmosphere */}
          <div className="absolute top-20 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-40 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-24 right-60 w-1.5 h-1.5 bg-white/35 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-slate-900 mb-8 leading-tight">
              Why you should<br />
              list with us?
            </h2>
          </div>
        </div>
      </section>

      {/* Recently Listed Section */}
      <section className="bg-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-slate-900 mb-4">
              Recently listed
            </h2>
          </div>
          
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Property 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Property Image */}
              <div className="relative h-64 bg-gradient-to-br from-blue-200 to-blue-300 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-white/10 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Property Type Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Villa
                  </span>
                </div>
                
                {/* Star Rating */}
                <div className="absolute top-4 right-4 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">West Square Villa</h3>
                
                {/* Stats */}
                <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    <span>2.8K View</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>160 Follower</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">5 beds - 7 baths - 9,780 sq. ft.</p>
                
                <div className="flex items-center justify-between">
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm hover:bg-slate-800 transition-colors">
                    View Details
                  </button>
                  <span className="text-lg font-semibold text-slate-900">AED 15.5M</span>
                </div>
              </div>
            </div>

            {/* Property 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Property Image */}
              <div className="relative h-64 bg-gradient-to-br from-green-200 to-green-300 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-white/10 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Property Type Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Villa
                  </span>
                </div>
                
                {/* Star Rating */}
                <div className="absolute top-4 right-4 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">West Square Villa</h3>
                
                {/* Stats */}
                <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    <span>2.8K View</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>160 Follower</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">5 beds - 7 baths - 9,780 sq. ft.</p>
                
                <div className="flex items-center justify-between">
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm hover:bg-slate-800 transition-colors">
                    View Details
                  </button>
                  <span className="text-lg font-semibold text-slate-900">AED 18.2M</span>
                </div>
              </div>
            </div>

            {/* Property 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Property Image */}
              <div className="relative h-64 bg-gradient-to-br from-orange-200 to-orange-300 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-white/10 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Property Type Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Villa
                  </span>
                </div>
                
                {/* Star Rating */}
                <div className="absolute top-4 right-4 flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">West Square Villa</h3>
                
                {/* Stats */}
                <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    <span>2.8K View</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>160 Follower</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">5 beds - 7 baths - 9,780 sq. ft.</p>
                
                <div className="flex items-center justify-between">
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm hover:bg-slate-800 transition-colors">
                    View Details
                  </button>
                  <span className="text-lg font-semibold text-slate-900">AED 22.8M</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-800 transition-colors duration-300 shadow-lg hover:shadow-xl">
              List your properties
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-light text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Get answers to common questions about listing your property with TRPE
            </p>
          </div>
          
          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border-0 overflow-hidden">
              <AccordionTrigger className="px-6 py-6 text-lg font-medium text-slate-900 hover:no-underline hover:bg-gray-50">
                How much does it cost to list my property on TRPE?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-700">
                Listing your property on TRPE is completely free. We only charge a commission when your property successfully sells, ensuring our interests are aligned with yours. Our competitive commission rates are transparent and discussed upfront, with no hidden fees or surprises.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border-0 overflow-hidden">
              <AccordionTrigger className="px-6 py-6 text-lg font-medium text-slate-900 hover:no-underline hover:bg-gray-50">
                What marketing services do you provide for listed properties?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-700">
                We provide comprehensive marketing services including professional photography, virtual tours, premium listing placement on our platform, social media promotion, and exposure to our network of qualified buyers and agents. Your property will also be featured across multiple property portals and marketing channels to maximize visibility.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border-0 overflow-hidden">
              <AccordionTrigger className="px-6 py-6 text-lg font-medium text-slate-900 hover:no-underline hover:bg-gray-50">
                How long does it typically take to sell a property through TRPE?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-700">
                The time to sell varies based on property type, location, pricing, and market conditions. On average, luxury properties in Dubai sell within 3-6 months through our platform. Our experienced team works closely with you to price competitively and implement effective marketing strategies to minimize time on market while maximizing value.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border-0 overflow-hidden">
              <AccordionTrigger className="px-6 py-6 text-lg font-medium text-slate-900 hover:no-underline hover:bg-gray-50">
                Do you provide support throughout the entire selling process?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-700">
                Yes, we provide end-to-end support throughout your selling journey. This includes property valuation, market analysis, professional staging advice, managing viewings, negotiating offers, handling paperwork, and coordinating with legal and financial professionals. Our dedicated team is available to guide you through every step of the process.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
