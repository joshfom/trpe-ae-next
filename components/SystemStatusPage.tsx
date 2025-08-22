'use client';

import React, { useState, useEffect } from 'react';
import { healthMonitor, checkApiHealth } from '@/lib/health-monitor';
import { errorMonitor } from '@/lib/error-monitor';
import { resilientApi } from '@/lib/resilient-api';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  apiUrl: string;
  responseTime?: number;
  error?: string;
  checks: {
    api: boolean;
    database?: boolean;
  };
}

export default function SystemStatusPage() {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState<Record<string, any>>({});

  const performHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkApiHealth();
      setHealthStatus(result);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial health check
    performHealthCheck();

    // Get recent errors
    const errors = errorMonitor.getErrors();
    setRecentErrors(errors.slice(-5)); // Last 5 errors

    // Get circuit breaker status
    const cbStatus = resilientApi.getCircuitBreakerStatus();
    setCircuitBreakerStatus(cbStatus);

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      performHealthCheck();
      
      // Update errors
      const newErrors = errorMonitor.getErrors();
      setRecentErrors(newErrors.slice(-5));
      
      // Update circuit breaker status
      const newCbStatus = resilientApi.getCircuitBreakerStatus();
      setCircuitBreakerStatus(newCbStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'degraded':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'unhealthy':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              System Status
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Real-time monitoring of our services and infrastructure
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={performHealthCheck}
              disabled={isChecking}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isChecking ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* API Health Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {healthStatus ? getStatusIcon(healthStatus.status) : getStatusIcon('unknown')}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      API Status
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {healthStatus ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(healthStatus.status)}`}>
                          {healthStatus.status.charAt(0).toUpperCase() + healthStatus.status.slice(1)}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-gray-600 bg-gray-100">
                          Checking...
                        </span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
              {healthStatus && (
                <div className="mt-4 text-sm text-gray-500">
                  <p>Last checked: {new Date(healthStatus.timestamp).toLocaleString()}</p>
                  {healthStatus.responseTime && (
                    <p>Response time: {healthStatus.responseTime}ms</p>
                  )}
                  {healthStatus.error && (
                    <p className="text-red-600 mt-1">Error: {healthStatus.error}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Monitor */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Recent Errors
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {recentErrors.length} errors in session
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => errorMonitor.clearErrors()}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Clear errors
                </button>
              </div>
            </div>
          </div>

          {/* Circuit Breakers */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Circuit Breakers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {Object.keys(circuitBreakerStatus).length} active
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Errors Details */}
        {recentErrors.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Errors
            </h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {recentErrors.map((error, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor('unhealthy')}`}>
                            {error.level}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {error.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(error.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {error.tags?.type && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100">
                            {error.tags.type}
                          </span>
                        )}
                      </div>
                    </div>
                    {error.extra?.suggestion && (
                      <div className="mt-2 text-sm text-blue-600">
                        💡 {error.extra.suggestion}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Circuit Breaker Details */}
        {Object.keys(circuitBreakerStatus).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Circuit Breaker Status
            </h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {Object.entries(circuitBreakerStatus).map(([operation, status]) => (
                  <li key={operation} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {operation}
                        </p>
                        <p className="text-sm text-gray-500">
                          State: {status.state} | Failures: {status.failures}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          status.state === 'closed' ? 'text-green-600 bg-green-100' :
                          status.state === 'half-open' ? 'text-yellow-600 bg-yellow-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {status.state}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
