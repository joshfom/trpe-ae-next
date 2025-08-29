'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";

// Mock Agent interface
interface MockAgent {
    id: string;
    firstName: string;
    lastName: string;
    slug: string;
    avatarUrl: string | null;
    title: string;
}

// Mock data for testing
const mockAgents: MockAgent[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
        avatarUrl: '/images/defaults/agent.jpg',
        title: 'Senior Real Estate Agent'
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        slug: 'jane-smith',
        avatarUrl: '/images/agent.jpg',
        title: 'Luxury Property Specialist'
    },
    {
        id: '3',
        firstName: 'Ahmed',
        lastName: 'Al Rashid',
        slug: 'ahmed-al-rashid',
        avatarUrl: 'https://via.placeholder.com/400x600/6b7280/ffffff?text=Ahmed',
        title: 'Investment Consultant'
    },
    {
        id: '4',
        firstName: 'Sarah',
        lastName: 'Johnson',
        slug: 'sarah-johnson',
        avatarUrl: null, // Test fallback
        title: 'Property Manager'
    }
];

// Client-side agent card component for testing
const MockAgentCard: React.FC<{ agent: MockAgent }> = ({ agent }) => {
    const agentUrl = `/our-team/${agent.slug}`;
    const agentName = `${agent.firstName} ${agent.lastName}`;
    
    // More robust avatar handling
    let avatarSrc = '/images/defaults/agent.jpg'; // Default fallback
    
    if (agent.avatarUrl) {
        // Handle various URL formats
        if (agent.avatarUrl.startsWith('http')) {
            avatarSrc = agent.avatarUrl;
        } else if (agent.avatarUrl.startsWith('/')) {
            avatarSrc = agent.avatarUrl;
        } else {
            // Assume it's a relative path and make it absolute
            avatarSrc = `/images/${agent.avatarUrl}`;
        }
    }

    const handleImageError = (e: any) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== '/images/defaults/agent.jpg') {
            console.log(`Image failed to load: ${target.src}, falling back to default`);
            target.src = '/images/defaults/agent.jpg';
        }
    };

    const handleImageLoad = () => {
        console.log(`Successfully loaded image for ${agentName}: ${avatarSrc}`);
    };

    return (
        <article className="flex flex-col pb-3 bg-white items-center">
            <Link href={agentUrl}>
                <span className="sr-only">View {agentName}</span>
                <div className="relative w-full h-96 rounded-3xl overflow-hidden bg-gray-100">
                    <Image 
                        src={avatarSrc}
                        alt={agentName}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                </div>
            </Link>
            <div className="w-full text-center mt-2">
                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link href={agentUrl}>
                        {agentName}
                    </Link>
                </h2>
                {agent.title && (
                    <p className="text-sm text-gray-600 mt-1">{agent.title}</p>
                )}
            </div>
        </article>
    );
};

// Mock agent list component for testing
const MockAgentList: React.FC = () => {
    return (
        <div className="py-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Mock Agent Data (For Testing)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockAgents.map((agent) => (
                    <MockAgentCard key={agent.id} agent={agent} />
                ))}
            </div>
        </div>
    );
};

export default MockAgentList;
