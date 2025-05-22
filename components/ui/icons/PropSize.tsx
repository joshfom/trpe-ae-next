import React from 'react';

const PropSize = ({
                      size = 24,
                      className = '',
                      color = 'currentColor',
                      strokeWidth = 2,
                      ...props
                  }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`stroke-current ${className}`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path
                d="M60.65.23a.78.78 0 0 0-1.1 1.1l1.79 1.79H12l1.79-1.79a.78.78 0 0 0-1.1-1.1l-3.1 3.12a.78.78 0 0 0 0 1.1l3.12 3.12a.78.78 0 0 0 1.1-1.1L12 4.68h49.3l-1.75 1.79a.78.78 0 0 0 1.1 1.1l3.12-3.12a.78.78 0 0 0 0-1.1Z"
                className={`text-${color}`}
            />
            <path
                d="M1.33 59.55a.78.78 0 0 0-1.1 1.1l3.12 3.12a.78.78 0 0 0 1.1 0l3.12-3.12a.78.78 0 0 0-1.1-1.1l-1.79 1.79V12l1.79 1.79a.78.78 0 1 0 1.1-1.1l-3.12-3.1a.78.78 0 0 0-1.1 0L.23 12.72a.78.78 0 1 0 1.1 1.1L3.12 12v49.3Z"
                className={`text-${color}`}
            />
            <path
                d="M37.23 9.59a.78.78 0 0 0-1.1 0L9.59 36.13a.78.78 0 0 0 1.1 1.1l2.46-2.46v28.45a.78.78 0 0 0 .78.78h45.5a.78.78 0 0 0 .78-.78V34.78l2.46 2.46a.78.78 0 1 0 1.1-1.1Zm21.42 52.85H14.72V33.22l22-22 22 22Z"
                className={`text-${color}`}
            />
        </svg>
    );
};

export default PropSize;