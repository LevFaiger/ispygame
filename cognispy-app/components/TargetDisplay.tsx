'use client';

import { GameType, HouseConfig, TransportType } from '@/types';
import HouseIcon from './HouseIcon';
import TransportIcon from './TransportIcon';
import { LEVELS } from '@/lib/constants';

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
      const levelIndex = Math.min(stage - 1, LEVELS.length - 1);
      const targets = LEVELS[levelIndex].targets;
      return (
        <div className="flex gap-2 justify-center">
          {targets.map((num, i) => (
            <span key={i} className="text-2xl font-bold text-indigo-600">
              {num}
            </span>
          ))}
        </div>
      );
    }

    if (typeof targetValue === 'string') {
      return <span className="text-3xl">{targetValue}</span>;
    }

    if (isHouseConfig(targetValue)) {
      return <HouseIcon config={targetValue} size={48} />;
    }

    if (isTransportType(targetValue)) {
      return <TransportIcon type={targetValue} size={48} />;
    }

    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-[60px]">
      {renderTarget()}
    </div>
  );
}
