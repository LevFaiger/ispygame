'use client';

import { TraceGameType } from '@/types';

interface TraceCategoryCardProps {
  type: TraceGameType;
  name: string;
  description: string;
  onClick: () => void;
}

const categoryIcons: Record<TraceGameType, { icon: string; bgColor: string; textColor: string }> = {
  arrows: {
    icon: '➡️',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-600',
  },
  shapes: {
    icon: '⭐',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-600',
  },
};

export default function TraceCategoryCard({ type, name, description, onClick }: TraceCategoryCardProps) {
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
