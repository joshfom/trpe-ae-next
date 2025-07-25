// Example implementation for your main layout.tsx

import GTMScript from '@/components/GTMScript';
import PageViewTracker from '@/components/PageViewTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* GTM Script should be in head */}
        <GTMScript />
      </head>
      <body>
        {/* Page View Tracker - automatically tracks all route changes */}
        <PageViewTracker 
          defaultPageData={{
            user_type: 'visitor', // You can make this dynamic based on auth state
            content_group1: 'trpe-ae',
            // Add any other default data you want on every page view
          }}
        />
        
        {children}
      </body>
    </html>
  );
}
