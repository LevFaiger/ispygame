
import React from 'react';
import { HouseConfig } from '../types';

interface HouseIconProps {
  config: HouseConfig;
  className?: string;
}

export const HouseIcon: React.FC<HouseIconProps> = ({ config, className = "" }) => {
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none" stroke="currentColor" strokeWidth="3">
      {/* House Base */}
      <path d="M20 40 L20 85 L80 85 L80 40 L50 15 Z" fill="white" strokeLinejoin="round" />
      
      {/* Chimney */}
      {config.chimney && (
        <path d="M65 25 L65 15 L75 15 L75 33" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Door */}
      {config.door === 'left' && <rect x="28" y="65" width="14" height="20" />}
      {config.door === 'center' && <rect x="43" y="65" width="14" height="20" />}
      {config.door === 'right' && <rect x="58" y="65" width="14" height="20" />}

      {/* Windows */}
      {config.windows === 'single' && <rect x="40" y="45" width="20" height="15" />}
      {config.windows === 'double' && (
        <>
          <rect x="30" y="45" width="15" height="12" />
          <rect x="55" y="45" width="15" height="12" />
        </>
      )}
      {config.windows === 'wide' && <rect x="30" y="45" width="40" height="12" />}
      {config.windows === 'split' && (
        <>
          <rect x="42" y="40" width="16" height="10" />
          <rect x="42" y="52" width="16" height="10" />
        </>
      )}
    </svg>
  );
};
