import Image from "next/image";

interface LuxeBlogCardProps {
  id?: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  href?: string;
  className?: string;
}

const LuxeBlogCard = ({ 
  title, 
  excerpt, 
  imageUrl, 
  href = "#", 
  className = "" 
}: LuxeBlogCardProps) => {
  return (
    <article className={`group cursor-pointer ${className}`}>
      {/* Blog Image */}
      <div className="relative h-64 w-full overflow-hidden  mb-6">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Blog Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 leading-relaxed">
          {excerpt}
        </p>
      </div>
    </article>
  );
};

interface LuxeBlogSectionProps {
  className?: string;
}

export default function LuxeBlogSection({ className = "" }: LuxeBlogSectionProps) {
  const blogPosts = [
    {
      id: "1",
      title: "West Square Villa",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "/blog/west-square-villa"
    },
    {
      id: "2", 
      title: "West Square Villa",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "/blog/west-square-villa-2"
    },
    {
      id: "3",
      title: "West Square Villa", 
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      href: "/blog/west-square-villa-3"
    }
  ];

  return (
    <section className={`w-full py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-playfair font-light text-gray-900 mb-4">
            Latest Blogs
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <LuxeBlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              imageUrl={post.imageUrl}
              href={post.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
