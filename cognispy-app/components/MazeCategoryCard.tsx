'use client';

import { MazeGameType } from '@/types';

interface MazeCategoryCardProps {
  type: MazeGameType;
  name: string;
  description: string;
  onClick: () => void;
}

const categoryIcons: Record<MazeGameType, { icon: string; bgColor: string; textColor: string }> = {
  keys: {
    icon: '🔑',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
  },
  threads: {
    icon: '🧵',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600',
  },
};

export default function MazeCategoryCard({ type, name, description, onClick }: MazeCategoryCardProps) {
  const { icon, bgColor, textColor } = categoryIcons[type];

  return (
    <button
      onClick={onClick}
      className="category-card w-full text-left"
    >
      <div className={`icon-box ${bgColor} ${textColor}`}>
        <span className="text-4xl">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-xl">{name}</h3>
        <p className="text-lg text-gray-500">{description}</p>
      </div>
    </button>
  );
}
