import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page No Longer Available | The Real Property Experts',
  description: 'This page is no longer available.',
};

export default function Gone410Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">410 - Page No Longer Available</h1>
      <p className="text-lg mb-8 text-center max-w-2xl">
        The page you are looking for has been permanently removed and is no longer available.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
}