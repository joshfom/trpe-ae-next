import SystemStatusPage from '@/components/SystemStatusPage';

export default function StatusPage() {
  return <SystemStatusPage />;
}

export const metadata = {
  title: 'System Status | TRPE',
  description: 'Real-time monitoring of our services and infrastructure',
  robots: 'noindex, nofollow', // Don't index status pages
};
