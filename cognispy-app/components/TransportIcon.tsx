'use client';

import { TransportType } from '@/types';

interface TransportIconProps {
  type: TransportType;
  size?: number;
}

export default function TransportIcon({ type, size = 48 }: TransportIconProps) {
  const renderIcon = () => {
    switch (type) {
      case 'car':
        return (
          <>
            <path d="M5 17h34l-4-7H9l-4 7z" />
            <rect x="3" y="17" width="38" height="10" rx="2" />
            <circle cx="12" cy="27" r="4" />
            <circle cx="32" cy="27" r="4" />
            <rect x="8" y="11" width="8" height="6" rx="1" />
            <rect x="26" y="11" width="8" height="6" rx="1" />
          </>
        );
      case 'bus':
        return (
          <>
            <rect x="6" y="8" width="32" height="26" rx="3" />
            <line x1="6" y1="28" x2="38" y2="28" />
            <rect x="10" y="12" width="6" height="8" />
            <rect x="19" y="12" width="6" height="8" />
            <rect x="28" y="12" width="6" height="8" />
            <circle cx="14" cy="32" r="3" />
            <circle cx="30" cy="32" r="3" />
          </>
        );
      case 'plane':
        return (
          <>
            <path d="M24 4 L28 18 L44 22 L28 26 L24 40 L20 26 L4 22 L20 18 Z" />
            <ellipse cx="24" cy="22" rx="4" ry="8" />
          </>
        );
      case 'bike':
        return (
          <>
            <circle cx="12" cy="28" r="8" fill="none" />
            <circle cx="36" cy="28" r="8" fill="none" />
            <path d="M12 28 L20 16 L28 16 L36 28" fill="none" />
            <line x1="20" y1="16" x2="24" y2="28" />
            <line x1="28" y1="16" x2="32" y2="12" />
            <circle cx="32" cy="12" r="2" />
          </>
        );
      case 'train':
        return (
          <>
            <rect x="8" y="10" width="28" height="22" rx="4" />
            <rect x="12" y="14" width="8" height="6" rx="1" />
            <rect x="24" y="14" width="8" height="6" rx="1" />
            <line x1="8" y1="26" x2="36" y2="26" />
            <circle cx="14" cy="34" r="3" />
            <circle cx="30" cy="34" r="3" />
            <rect x="18" y="6" width="8" height="4" rx="1" />
          </>
        );
      case 'boat':
        return (
          <>
            <path d="M4 32 Q24 40 44 32 L40 22 L8 22 Z" />
            <rect x="20" y="10" width="4" height="12" />
            <path d="M24 10 L36 18 L24 18 Z" fill="none" />
          </>
        );
      default:
        return null;
    }
  };

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
      {renderIcon()}
    </svg>
  );
}
