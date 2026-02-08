'use client';

import { FindDiffGameType } from '@/types';

interface FindDiffCategoryCardProps {
  type: FindDiffGameType;
  name: string;
  description: string;
  onClick: () => void;
}

const categoryIcons: Record<FindDiffGameType, { icon: string; bgColor: string; textColor: string }> = {
  shoes: {
    icon: '👟',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-600',
  },
  bears: {
    icon: '🐻',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
  },
};

export default function FindDiffCategoryCard({ type, name, description, onClick }: FindDiffCategoryCardProps) {
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
