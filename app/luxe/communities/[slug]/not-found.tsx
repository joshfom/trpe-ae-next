import Link from 'next/link';

export default function CommunityNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl font-playfair font-light text-gray-900 mb-6">404</h1>
        <h2 className="text-3xl lg:text-4xl font-playfair font-light text-gray-900 mb-6">
          Community Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The luxury community you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/luxe/communities"
            className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            View All Communities
          </Link>
          <Link
            href="/luxe"
            className="inline-block border border-black text-black px-8 py-3 rounded-md font-medium hover:bg-black hover:text-white transition-colors"
          >
            Back to Luxe Home
          </Link>
        </div>
      </div>
    </div>
  );
}
