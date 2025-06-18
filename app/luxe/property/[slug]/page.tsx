import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Home, Maximize2, ChevronDown } from "lucide-react";

export default function PropertyDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 to-blue-300">
            {/* Placeholder for property image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-xl font-medium">Property Image</div>
            </div>
            
            {/* Property type badge */}
            <div className="absolute top-6 left-6">
              <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full text-sm font-medium">
                Villa
              </span>
            </div>
            
            {/* Image thumbnails overlay */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-16 h-12 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-white/50"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Property Info */}
            <div>
              {/* Estate Name and Location */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-light text-slate-900 mb-4">
                  Estate Name
                </h1>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Emirates Tower, Dubai</span>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-medium text-slate-900 mb-4">Price:</h2>
                  <p className="text-3xl font-light text-slate-900">AED 250,000</p>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices 
                    gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem 
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. 
                    Risus commodo viverra maecenas accumsan lacus vel facilisis.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Image Gallery */}
            <div>
              {/* Main Property Image */}
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-xl font-medium">Main Property Image</div>
                </div>
              </div>
              
              {/* Thumbnail Images - 3 in a row */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i}
                    className="relative h-24 lg:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-sm">Image {i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floor Plans */}
          <div className="mb-12">
                <h2 className="text-2xl font-medium text-slate-900 mb-6">Floor Plans</h2>
                <p className="text-gray-600 mb-6">Apartment</p>
                
                <div className="space-y-4">
                  {/* First floor plan - expanded */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Home className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">5 Beds</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Maximize2 className="w-5 h-5 text-gray-600" />
                            <span>9,642 - 9,642 Sqft</span>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-600 transform rotate-180" />
                      </div>
                    </div>
                    
                    {/* Floor plan details */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Type</p>
                          <p className="font-medium">Split - Sky Mansion</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Size (Sqft)</p>
                          <p className="font-medium">9,642</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Floor Plan</p>
                          <div className="flex space-x-2">
                            <div className="w-12 h-16 bg-gray-200 rounded"></div>
                            <div className="w-12 h-16 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other floor plans - collapsed */}
                  <div className="border rounded-lg">
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Home className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">6 Beds</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Maximize2 className="w-5 h-5 text-gray-600" />
                            <span>15,323 - 12,372 Sqft</span>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Home className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">7 Beds</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Maximize2 className="w-5 h-5 text-gray-600" />
                            <span>16,842 - 16,842 Sqft</span>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-12">
                <h2 className="text-2xl font-medium text-slate-900 mb-6">Location</h2>
                
                {/* Map placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-700">Interactive Map</p>
                      <p className="text-sm text-gray-500">Emirates Tower, Dubai</p>
                    </div>
                  </div>
                  
                  {/* Map pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-12">
                <h2 className="text-2xl font-medium text-slate-900 mb-6">Amenities</h2>
                
                <div className="grid grid-cols-3 gap-8">
                  {/* First row */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm text-gray-700">Pool</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm text-gray-700">GYM</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm text-gray-700">Beach</span>
                  </div>

                  {/* Second row */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm text-gray-700">Pool</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm text-gray-700">GYM</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm text-gray-700">Beach</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-12">
                <h2 className="text-2xl font-medium text-slate-900 mb-6">FAQ's</h2>
                
                <Accordion type="single" collapsible className="w-full space-y-3">
                  <AccordionItem value="item-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4 text-left font-medium text-slate-900 hover:no-underline">
                      What are the payment terms for this property?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-700">
                      Payment terms include flexible options with installment plans available. 
                      Contact our sales team for detailed payment schedules and financing options.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4 text-left font-medium text-slate-900 hover:no-underline">
                      What amenities are included in the community?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-700">
                      The community includes a swimming pool, fully equipped gym, beach access, 
                      landscaped gardens, children's play areas, and 24/7 security services.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4 text-left font-medium text-slate-900 hover:no-underline">
                      When is the expected handover date?
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-700">
                      The project is scheduled for completion in Q2 2026. Regular construction 
                      updates are provided to buyers throughout the development process.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

          {/* Contact Section - Full Width Below */}
          <div className="mt-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-medium text-slate-900 mb-4">
                  Interested in this property?
                </h3>
                <p className="text-gray-600 mb-8">
                  Get in touch with our expert team for more details and to schedule a viewing.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button className="bg-slate-900 text-white py-3 px-8 rounded-full font-medium hover:bg-slate-800 transition-colors">
                    Schedule Viewing
                  </button>
                  <button className="border border-slate-300 text-slate-900 py-3 px-8 rounded-full font-medium hover:bg-gray-50 transition-colors">
                    Request Info
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">Agent Name</p>
                    <p className="text-sm text-gray-600">Senior Property Consultant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}