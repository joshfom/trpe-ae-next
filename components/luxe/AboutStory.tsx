import Image from 'next/image';

export function AboutStory() {
  const storyContent = {
    title: "Our Story",
    sections: [
      {
        id: 1,
        text: "In a world that celebrates noise, we chose something quieter.\nBut our silence wasn't easy, it was earned.\n\nIn 2006, a young agent stepped into the London property market with nothing but a license, determination, and a promise: to never sell homes like products. To sell space as possibility.\n\nThe early years were brutal. Markets crashed. Partnerships failed. Between 2007 and 2011, four ventures fell apart, each one a lesson, not a loss.\nThe hardest years of real estate became the foundation of something unshakable.",
        image: "https://images.unsplash.com/photo-1544092683-c0c9ebb368e5?q=80&w=3251&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageAlt: "London property market early days",
        imagePosition: "right"
      },
      {
        id: 2,
        text: "In 2011, that foundation became Nazemi Property Consultancy, the first true shape of a vision built on consistency, clarity, and quiet ambition.\n\nBy 2019, with new momentum, ADN Holding was formed in London, followed by Fix My Property, a boutique renovation and maintenance firm born from a belief: real estate is not just about finding homes, but making them better.\n\nIn 2020, the vision evolved. A rebrand to TRPE, The Real Property Experts. No gimmicks. No noise. Just presence and process.\n\nAnd in 2022, TRPE crossed borders, bringing that same quiet trust to Dubai's bold skyline.",
        image: "https://images.unsplash.com/photo-1544092683-c0c9ebb368e5?q=80&w=3251&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageAlt: "TRPE expansion to Dubai",
        imagePosition: "left"
      },
      {
        id: 3,
        text: "TRPE Luxe was born on 05.05.2025.\nNot as a launch. As a reveal.\n\nA response to a clear gap in the market: Dubai's luxury deserved something more, not louder, but deeper. Not flash, but feeling.\n\nBecause true luxury isn't a listing. It's a lived experience.\nAnd every experience begins with trust.",
        image: "https://images.unsplash.com/photo-1544092683-c0c9ebb368e5?q=80&w=3251&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageAlt: "TRPE Luxe Dubai luxury properties",
        imagePosition: "right"
      }
    ]
  };

  return (
    <section id="our-story" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900">
            {storyContent.title}
          </h2>
        </div>

        {/* Story Sections */}
        <div className="space-y-16 sm:space-y-20 lg:space-y-24">
          {storyContent.sections.map((section) => (
            <div 
              key={section.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center ${
                section.imagePosition === 'left' ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Text Content */}
              <div className={`${
                section.imagePosition === 'left' ? 'lg:col-start-2' : ''
              }`}>
                <div className="prose prose-lg max-w-none">
                  {section.text.split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 mb-4 sm:mb-6"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className={`${
                section.imagePosition === 'left' ? 'lg:col-start-1 lg:row-start-1' : ''
              }`}>
                <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
