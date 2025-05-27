'use client';

import React, { useEffect, useState } from 'react';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  delta: number;
  entries: any[];
}

export interface WebVitalsReport {
  cls: WebVitalsMetric | null;
  inp: WebVitalsMetric | null;  // INP replaced FID in web-vitals v4+
  fcp: WebVitalsMetric | null;
  lcp: WebVitalsMetric | null;
  ttfb: WebVitalsMetric | null;
  timestamp: number;
  url: string;
  userAgent: string;
}

class WebVitalsTrackerClass {
  private metrics: Partial<WebVitalsReport> = {};
  private callbacks: Array<(report: WebVitalsReport) => void> = [];

  constructor() {
    this.initTracking();
  }

  private async initTracking() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      // Dynamically import web-vitals to avoid SSR issues
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
      
      // Track Core Web Vitals
      onCLS(this.handleMetric.bind(this));
      onINP(this.handleMetric.bind(this));
      onFCP(this.handleMetric.bind(this));
      onLCP(this.handleMetric.bind(this));
      onTTFB(this.handleMetric.bind(this));
    } catch (error) {
      console.warn('Web Vitals library not available:', error);
    }
  }

  private handleMetric(metric: any) {
    const vitalsMetric: WebVitalsMetric = {
      name: metric.name,
      value: metric.value,
      rating: this.getRating(metric.name, metric.value),
      id: metric.id,
      delta: metric.delta,
      entries: metric.entries
    };

    // Store the metric
    (this.metrics as any)[metric.name.toLowerCase()] = vitalsMetric;

    // Check if we have all metrics to generate a complete report
    this.tryGenerateReport();

    // Send individual metric to analytics
    this.sendMetricToAnalytics(vitalsMetric);
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    // Thresholds based on Google's Core Web Vitals recommendations
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 },  // INP thresholds (milliseconds)
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private tryGenerateReport() {
    // Generate report when we have at least LCP, INP, and CLS (core metrics)
    if (this.metrics.lcp && this.metrics.cls && (this.metrics.inp || this.metrics.fcp)) {
      const report: WebVitalsReport = {
        cls: this.metrics.cls || null,
        inp: this.metrics.inp || null,
        fcp: this.metrics.fcp || null,
        lcp: this.metrics.lcp || null,
        ttfb: this.metrics.ttfb || null,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // Notify all callbacks
      this.callbacks.forEach(callback => callback(report));
    }
  }

  private async sendMetricToAnalytics(metric: WebVitalsMetric) {
    try {
      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          custom_parameter_1: metric.id
        });
      }

      // Send to our analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
            url: window.location.href,
            timestamp: Date.now()
          })
        });
      }
    } catch (error) {
      console.error('Failed to send Web Vitals to analytics:', error);
    }
  }

  public onReport(callback: (report: WebVitalsReport) => void) {
    this.callbacks.push(callback);
  }

  public getMetrics() {
    return this.metrics;
  }
}

// Singleton instance
const webVitalsTracker = new WebVitalsTrackerClass();

/**
 * Initialize Web Vitals tracking
 * Call this in your app's root component
 */
export function initWebVitals() {
  return webVitalsTracker;
}

/**
 * Register a callback for when Web Vitals reports are complete
 */
export function onWebVitalsReport(callback: (report: WebVitalsReport) => void) {
  webVitalsTracker.onReport(callback);
}

/**
 * Get current metrics (may be incomplete)
 */
export function getCurrentWebVitals() {
  return webVitalsTracker.getMetrics();
}

/**
 * Component to inject Web Vitals tracking
 */
export function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null; // This component just initializes tracking
}

/**
 * Debug component to show current Web Vitals in development
 */
export function WebVitalsDebug() {
  const [metrics, setMetrics] = useState<Partial<WebVitalsReport>>({});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const tracker = initWebVitals();
    
    const updateMetrics = () => {
      setMetrics(tracker.getMetrics());
    };

    // Update metrics every second in development
    const interval = setInterval(updateMetrics, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return React.createElement('div', {
    className: "fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50"
  }, [
    React.createElement('h3', {
      key: 'title',
      className: "font-bold mb-2"
    }, 'Web Vitals (DEV)'),
    ...Object.entries(metrics).map(([key, metric]) => 
      React.createElement('div', {
        key,
        className: "flex justify-between gap-4"
      }, [
        React.createElement('span', { key: 'label' }, key.toUpperCase() + ':'),
        React.createElement('span', {
          key: 'value',
          className: `${
            (metric as WebVitalsMetric)?.rating === 'good' ? 'text-green-400' :
            (metric as WebVitalsMetric)?.rating === 'needs-improvement' ? 'text-yellow-400' :
            'text-red-400'
          }`
        }, (metric as WebVitalsMetric)?.value ? Math.round((metric as WebVitalsMetric).value).toString() : 'N/A')
      ])
    )
  ]);
}