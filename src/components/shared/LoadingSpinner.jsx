import React from 'react';

export default function LoadingSpinner({
    sizeClass = 'h-8 w-8',
    colorClass = 'border-t-blue-500',
    className = '',
}) {
    return (
        <div
            role="status"
            aria-label="Loading"
            className={`
        animate-spin
        inline-block
        rounded-full
        border-4
        border-gray-200
        ${colorClass}
        ${sizeClass}
        ${className}
      `}
        />
    );
}
