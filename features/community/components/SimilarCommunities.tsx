"use client"
import React, { memo } from 'react';

const SimilarCommunities = memo(() => {
    return (
        <div>
            <h2 className={'text-2xl font-semibold'}> Similar Communities</h2>

            <div className="max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

            </div>

        </div>
    );
});

SimilarCommunities.displayName = 'SimilarCommunities';

export default SimilarCommunities;