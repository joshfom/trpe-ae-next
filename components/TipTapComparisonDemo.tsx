"use client";

import { useState } from 'react';
import { OptimizedTipTapView } from './OptimizedTipTapView';
import { TipTapView } from './TiptapView';

/**
 * Component to demonstrate and compare different TipTap rendering approaches
 * Shows the original TipTapView and the OptimizedTipTapView side by side
 */
export function TipTapComparisonDemo({ content }: { content: string }) {
  const [showOptimized, setShowOptimized] = useState(true);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-end space-x-4">
        <button 
          onClick={() => setShowOptimized(false)}
          className={`px-4 py-2 rounded-md ${!showOptimized ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Original Renderer
        </button>
        <button 
          onClick={() => setShowOptimized(true)}
          className={`px-4 py-2 rounded-md ${showOptimized ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Optimized Renderer
        </button>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-medium mb-4">
          {showOptimized ? 'Optimized TipTap View' : 'Original TipTap View'}
        </h2>
        
        <div className="bg-white rounded-lg shadow-sm">
          {showOptimized ? (
            <OptimizedTipTapView content={content} />
          ) : (
            <TipTapView content={content} />
          )}
        </div>
        
        <p className="mt-4 text-sm text-gray-500">
          {showOptimized ? 
            'The optimized renderer properly handles empty paragraphs and adds appropriate spacing.' :
            'The original renderer may not show proper spacing between empty paragraphs.'}
        </p>
      </div>
    </div>
  );
}
