'use client';

import React from 'react';
import Image from "next/image";

// Test component to verify image loading
const TestImageComponent: React.FC = () => {
    const testImages = [
        '/images/defaults/agent.jpg',
        '/images/agent.jpg',
        '/images/agent.png',
        'https://via.placeholder.com/300x400/cccccc/666666?text=Agent'
    ];

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Image Loading Test</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {testImages.map((src, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="relative w-40 h-52 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                                src={src}
                                alt={`Test image ${index + 1}`}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    console.error(`Failed to load image ${index + 1}:`, src);
                                }}
                                onLoad={() => {
                                    console.log(`Successfully loaded image ${index + 1}:`, src);
                                }}
                            />
                        </div>
                        <p className="text-sm mt-2 text-center break-all">{src}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestImageComponent;
