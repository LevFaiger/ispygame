'use client';

import { CircleItem } from '@/types';
import CircleButton from './CircleButton';

interface GameBoardProps {
  circles: CircleItem[];
  onCircleClick: (id: string) => void;
}

export default function GameBoard({ circles, onCircleClick }: GameBoardProps) {
  return (
    <div className="relative w-full max-w-[500px] md:max-w-[650px] aspect-square bg-gray-50 rounded-3xl overflow-hidden mx-auto">
      {circles.map((circle) => (
        <CircleButton
          key={circle.id}
          item={circle}
          onClick={() => onCircleClick(circle.id)}
        />
      ))}
    </div>
  );
}
