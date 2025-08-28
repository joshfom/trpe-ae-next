import { NextRequest, NextResponse } from 'next/server';

// For static export compatibility
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  navigationType: string;
  path: string;
  userAgent: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const metrics: WebVitalMetric[] = await request.json();
    
    // Log metrics for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vitals Metrics:', metrics);
    }
    
    // In production, you would typically:
    // 1. Store metrics in a database
    // 2. Send to analytics service (Google Analytics, DataDog, etc.)
    // 3. Trigger alerts for poor performance
    
    for (const metric of metrics) {
      // Example: Store in database
      // await db.insert(webVitalsTable).values({
      //   id: metric.id,
      //   name: metric.name,
      //   value: metric.value,
      //   rating: metric.rating,
      //   path: metric.path,
      //   userAgent: metric.userAgent,
      //   timestamp: new Date(metric.timestamp),
      // });
      
      // Example: Send to external analytics
      if (process.env.ANALYTICS_ENDPOINT) {
        await fetch(process.env.ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ANALYTICS_TOKEN}`,
          },
          body: JSON.stringify({
            event: 'web_vital',
            properties: {
              metric_name: metric.name,
              metric_value: metric.value,
              metric_rating: metric.rating,
              page_path: metric.path,
              timestamp: metric.timestamp,
            },
          }),
        }).catch((error) => {
          console.error('Failed to send metric to analytics:', error);
        });
      }
      
      // Trigger alerts for poor performance
      if (metric.rating === 'poor') {
        console.warn(`⚠️ Poor ${metric.name} performance detected:`, {
          value: metric.value,
          path: metric.path,
          threshold: getThreshold(metric.name),
        });
        
        // In production, you might want to:
        // - Send Slack/Discord notification
        // - Create incident in monitoring system
        // - Trigger automated optimization
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: metrics.length 
    });
    
  } catch (error) {
    console.error('Error processing Web Vitals metrics:', error);
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}

function getThreshold(metricName: string): number {
  const thresholds = {
    'CLS': 0.25,      // Cumulative Layout Shift
    'FID': 300,       // First Input Delay (ms)
    'FCP': 3000,      // First Contentful Paint (ms)
    'LCP': 4000,      // Largest Contentful Paint (ms)
    'TTFB': 1800,     // Time to First Byte (ms)
    'INP': 500,       // Interaction to Next Paint (ms)
  };
  
  return thresholds[metricName as keyof typeof thresholds] || 0;
}

// Optional: GET endpoint for retrieving metrics
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const metric = searchParams.get('metric');
  const days = parseInt(searchParams.get('days') || '7');
  
  try {
    // In production, query your database for metrics
    // const metrics = await db.select()
    //   .from(webVitalsTable)
    //   .where(
    //     and(
    //       path ? eq(webVitalsTable.path, path) : undefined,
    //       metric ? eq(webVitalsTable.name, metric) : undefined,
    //       gte(webVitalsTable.timestamp, new Date(Date.now() - days * 24 * 60 * 60 * 1000))
    //     )
    //   )
    //   .orderBy(desc(webVitalsTable.timestamp));
    
    // For now, return sample data structure
    return NextResponse.json({
      metrics: [],
      summary: {
        averages: {},
        trends: {},
        alerts: 0,
      },
    });
    
  } catch (error) {
    console.error('Error retrieving Web Vitals metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}
