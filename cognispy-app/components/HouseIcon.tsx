'use client';

import { HouseConfig } from '@/types';

interface HouseIconProps {
  config: HouseConfig;
  size?: number;
}

export default function HouseIcon({ config, size = 48 }: HouseIconProps) {
  const { door, windows, chimney } = config;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Roof */}
      <path d="M4 24 L24 8 L44 24" />

      {/* Chimney */}
      {chimney && (
        <rect x="32" y="10" width="6" height="10" fill="none" />
      )}

      {/* House body */}
      <rect x="8" y="24" width="32" height="20" fill="none" />

      {/* Door variations */}
      {door === 'left' && <rect x="12" y="32" width="8" height="12" />}
      {door === 'center' && <rect x="20" y="32" width="8" height="12" />}
      {door === 'right' && <rect x="28" y="32" width="8" height="12" />}

      {/* Window variations */}
      {windows === 'single' && (
        <rect x="28" y="28" width="6" height="6" />
      )}
      {windows === 'double' && (
        <>
          <rect x="12" y="28" width="6" height="6" />
          <rect x="30" y="28" width="6" height="6" />
        </>
      )}
      {windows === 'wide' && (
        <rect x="14" y="28" width="10" height="6" />
      )}
      {windows === 'split' && (
        <>
          <rect x="12" y="28" width="5" height="5" />
          <rect x="31" y="28" width="5" height="5" />
        </>
      )}
    </svg>
  );
}
