
import React from 'react';
import { TransportType } from '../types';

interface TransportIconProps {
  type: TransportType;
  className?: string;
}

export const TransportIcon: React.FC<TransportIconProps> = ({ type, className = "" }) => {
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} fill="none" stroke="currentColor" strokeWidth="3">
      {type === 'car' && (
        <>
          <path d="M15 70 L85 70 L85 55 L75 55 L65 35 L35 35 L25 55 L15 55 Z" strokeLinejoin="round" />
          <circle cx="30" cy="70" r="8" fill="white" />
          <circle cx="70" cy="70" r="8" fill="white" />
          <path d="M25 55 L75 55" />
          <rect x="40" y="42" width="10" height="8" />
          <rect x="55" y="42" width="10" height="8" />
        </>
      )}
      {type === 'bus' && (
        <>
          <rect x="15" y="30" width="70" height="40" rx="4" strokeLinejoin="round" />
          <circle cx="30" cy="70" r="8" fill="white" />
          <circle cx="70" cy="70" r="8" fill="white" />
          <rect x="22" y="38" width="12" height="15" />
          <rect x="38" y="38" width="12" height="15" />
          <rect x="54" y="38" width="12" height="15" />
          <rect x="70" y="38" width="8" height="25" />
        </>
      )}
      {type === 'plane' && (
        <>
          <path d="M15 50 Q15 40 50 40 L85 45 L85 55 L50 60 Q15 60 15 50" strokeLinejoin="round" />
          <path d="M45 40 L55 20 L65 40" strokeLinejoin="round" />
          <path d="M45 60 L55 80 L65 60" strokeLinejoin="round" />
          <path d="M15 50 L10 35 L20 40" strokeLinejoin="round" />
        </>
      )}
      {type === 'bike' && (
        <>
          <circle cx="30" cy="70" r="15" />
          <circle cx="70" cy="70" r="15" />
          <path d="M30 70 L50 50 L70 70 M50 50 L45 35 L60 35 M45 35 L35 30" strokeLinejoin="round" />
          <path d="M70 70 L65 45 L75 45 L85 40" strokeLinejoin="round" />
        </>
      )}
      {type === 'train' && (
        <>
          <rect x="15" y="40" width="50" height="30" rx="2" />
          <rect x="65" y="25" width="20" height="45" rx="2" />
          <circle cx="30" cy="70" r="6" />
          <circle cx="50" cy="70" r="6" />
          <circle cx="75" cy="70" r="6" />
          <path d="M65 35 L85 35" />
          <path d="M15 55 L65 55" />
        </>
      )}
      {type === 'boat' && (
        <>
          <path d="M15 60 L85 60 L75 80 L25 80 Z" strokeLinejoin="round" />
          <rect x="35" y="40" width="30" height="20" />
          <path d="M50 40 L50 20 L70 40" strokeLinejoin="round" />
          <circle cx="45" cy="50" r="3" />
          <circle cx="55" cy="50" r="3" />
        </>
      )}
    </svg>
  );
};
