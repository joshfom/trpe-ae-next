import React from 'react';

interface PageMetaLayoutProps {
  children: React.ReactNode;
}

export default function PageMetaLayout({ children }: PageMetaLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Management</h1>
        <p className="text-muted-foreground">
          Create and manage content pages with custom meta tags.
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}
