'use client';

import { GameType, HouseConfig, TransportType } from '@/types';
import HouseIcon from './HouseIcon';
import TransportIcon from './TransportIcon';

interface TargetDisplayProps {
  gameType: GameType;
  targetValue: number | string | HouseConfig | TransportType | null;
  stage: number;
}

function isHouseConfig(value: unknown): value is HouseConfig {
  return typeof value === 'object' && value !== null && 'door' in value && 'windows' in value;
}

function isTransportType(value: unknown): value is TransportType {
  return typeof value === 'string' && ['car', 'bus', 'plane', 'bike', 'train', 'boat'].includes(value);
}

export default function TargetDisplay({ gameType, targetValue, stage }: TargetDisplayProps) {
  const renderTarget = () => {
    if (gameType === 'numbers') {
      // Show only the current target number
      return (
        <span className="text-3xl font-bold text-indigo-600">
          {targetValue}
        </span>
      );
    }

    if (isHouseConfig(targetValue)) {
      return <HouseIcon config={targetValue} size={48} />;
    }

    if (isTransportType(targetValue)) {
      return <TransportIcon type={targetValue} size={48} />;
    }

    if (typeof targetValue === 'string') {
      // Emoji for weather game
      return <span className="text-3xl">{targetValue}</span>;
    }

    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-[60px]">
      {renderTarget()}
    </div>
  );
}
