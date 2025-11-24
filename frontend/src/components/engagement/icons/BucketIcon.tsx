import React from 'react';

interface BucketIconProps extends React.SVGProps<SVGSVGElement> {
  strokeWidth?: number;
}

export const BucketIcon: React.FC<BucketIconProps> = ({
  className = 'w-6 h-6',
  strokeWidth = 2,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path
      d="M4 7h16l-1.6 11.2a4 4 0 0 1-4 3.5H9.6a4 4 0 0 1-4-3.5L4 7Z"
      fill="currentColor"
      fillOpacity={0.18}
    />
    <path d="M7 7c0-2 2.8-3.8 5-3.8S17 5 17 7" />
    <path d="M7 7c0 1.8 2.2 3.3 5 3.3S17 8.8 17 7" />
    <path d="M12 3.2V2" />
    <path d="M9.8 11.5h4.4" opacity={0.7} />
  </svg>
);


