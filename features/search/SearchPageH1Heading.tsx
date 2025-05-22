import React from 'react';

interface SearchPageH1HeadingProps {
    heading: string;
}

function SearchPageH1Heading({heading}: SearchPageH1HeadingProps) {
    return (
        <h1 className={'flex text-2xl'}>
            {heading}
        </h1>
    );
}

export default SearchPageH1Heading;