'use client';

import { CircleItem, HouseConfig, TransportType } from '@/types';
import HouseIcon from './HouseIcon';
import TransportIcon from './TransportIcon';

interface CircleButtonProps {
  item: CircleItem;
  onClick: () => void;
}

function isHouseConfig(value: unknown): value is HouseConfig {
  return typeof value === 'object' && value !== null && 'door' in value && 'windows' in value;
}

function isTransportType(value: unknown): value is TransportType {
  return typeof value === 'string' && ['car', 'bus', 'plane', 'bike', 'train', 'boat'].includes(value);
}

export default function CircleButton({ item, onClick }: CircleButtonProps) {
  const { value, isFound, x, y, rotation, zIndex } = item;
  const isNumber = typeof value === 'number';

  // For numbers game: hide completely when found
  if (isNumber && isFound) {
    return null;
  }

  const renderContent = () => {
    if (isNumber) {
      return (
        <span className="text-2xl md:text-3xl font-bold text-gray-700">
          {value}
        </span>
      );
    }

    if (isHouseConfig(value)) {
      return <HouseIcon config={value} size={40} />;
    }

    if (isTransportType(value)) {
      return <TransportIcon type={value} size={40} />;
    }

    if (typeof value === 'string') {
      // Emoji for weather game
      return (
        <span className="text-2xl md:text-3xl">
          {value}
        </span>
      );
    }

    return null;
  };

  return (
    <button
      onClick={onClick}
      disabled={isFound}
      className={`game-item absolute transform -translate-x-1/2 -translate-y-1/2 ${
        isFound ? 'found' : 'bg-white hover:bg-gray-50'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex,
        boxShadow: isFound ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {isFound ? (
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        renderContent()
      )}
    </button>
  );
}
