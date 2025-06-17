import { AboutHero, AboutStory, TypesOfEstate, OurAgents } from '@/components/luxe';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AboutHero />
      
      {/* Our Story Section */}
      <AboutStory />

      {/* Types of Estate Section */}
      <TypesOfEstate />

      {/* Dark Section with Centered Content */}
      <section className='w-full py-20 bg-slate-900'>
          <div className='max-w-4xl mx-auto px-4 text-center'>
              {/* H2 Title */}
              <p className='text-gray-400 text-sm uppercase tracking-wider mb-4'>
                  H2 Title
              </p>
              
              {/* Main Title */}
              <h2 className='text-white text-4xl lg:text-6xl font-playfair font-light mb-8'>
                  Main Title
              </h2>
              
              {/* Description */}
              <p className='text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna 
                  aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
              </p>
          </div>
      </section>

      {/* Our Agents Section */}
      <OurAgents />

        {/* Footer Hero Section */}
    </div>
  );
}

export const metadata = {
  title: 'About Us | Luxe Real Estate',
  description: 'Learn about our story and commitment to luxury real estate excellence.',
};
