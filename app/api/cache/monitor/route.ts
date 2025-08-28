import { NextRequest, NextResponse } from 'next/server';
import { CacheHealthMonitor } from '@/lib/monitored-cache';

// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const namespace = searchParams.get('namespace');
    const action = searchParams.get('action');
    
    const monitor = CacheHealthMonitor.getInstance();
    
    switch (action) {
      case 'health':
        if (namespace) {
          const health = monitor.getHealth(namespace);
          return NextResponse.json({ success: true, data: health });
        } else {
          const allHealth = monitor.getHealth();
          return NextResponse.json({ success: true, data: allHealth });
        }
        
      case 'metrics':
        const metrics = monitor.getMetrics(namespace || undefined);
        return NextResponse.json({ success: true, data: metrics });
        
      default:
        // Return both health and metrics by default
        const allHealth = monitor.getHealth();
        const allMetrics = monitor.getMetrics();
        return NextResponse.json({ 
          success: true, 
          data: { health: allHealth, metrics: allMetrics } 
        });
    }
  } catch (error) {
    console.error('Cache monitor error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve cache data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const namespace = searchParams.get('namespace');
    
    const monitor = CacheHealthMonitor.getInstance();
    
    switch (action) {
      case 'clear':
        monitor.clearMetrics(namespace || undefined);
        return NextResponse.json({ 
          success: true, 
          message: namespace 
            ? `Cleared metrics for namespace: ${namespace}` 
            : 'Cleared all metrics' 
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cache monitor error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
