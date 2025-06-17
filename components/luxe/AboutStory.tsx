import Image from 'next/image';

export function AboutStory() {
  const storyContent = {
    title: "Our Story",
    sections: [
      {
        id: 1,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
        image: "/api/placeholder/500/400",
        imageAlt: "Modern architectural building",
        imagePosition: "right"
      },
      {
        id: 2,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
        image: "/api/placeholder/500/400",
        imageAlt: "Contemporary building design",
        imagePosition: "left"
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
                  <Image
                    src={section.image}
                    alt={section.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
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
