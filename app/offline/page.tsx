'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function OfflinePage() {
  useEffect(() => {
    // Set document title for client-side
    document.title = 'You\'re Offline | TRPE Global';
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Offline Icon */}
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-8 h-8 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You&apos;re Offline
          </h1>
          
          <p className="text-gray-600 mb-6">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry - you can still browse previously viewed properties and pages.
          </p>

          {/* Cached Content Links */}
          <div className="space-y-3 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Available Offline:
            </h2>
            
            <div className="grid gap-2">
              <Link 
                href="/" 
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">Home</div>
                <div className="text-sm text-gray-600">Browse featured properties</div>
              </Link>
              
              <Link 
                href="/luxe" 
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">Luxe Collection</div>
                <div className="text-sm text-gray-600">Premium properties</div>
              </Link>
              
              <Link 
                href="/properties" 
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-medium text-gray-900">All Properties</div>
                <div className="text-sm text-gray-600">Search our listings</div>
              </Link>
            </div>
          </div>

          {/* Retry Button */}
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>

          {/* Connection Status */}
          <div className="mt-4 text-sm text-gray-500">
            <span id="connection-status">Checking connection...</span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">💡 <strong>Tip:</strong> This app works offline!</p>
          <p>Previously viewed properties and pages are saved for offline viewing.</p>
        </div>
      </div>

      {/* Connection Detection Script */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            function updateConnectionStatus() {
              const statusEl = document.getElementById('connection-status');
              if (navigator.onLine) {
                statusEl.textContent = 'Connection restored! You can refresh the page.';
                statusEl.className = 'text-green-600 font-medium';
              } else {
                statusEl.textContent = 'Still offline. Check your internet connection.';
                statusEl.className = 'text-gray-500';
              }
            }
            
            // Check connection status on load
            updateConnectionStatus();
            
            // Listen for connection changes
            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
          `
        }}
      />
    </div>
  );
}
