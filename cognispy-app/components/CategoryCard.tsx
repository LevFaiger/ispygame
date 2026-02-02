'use client';

import { GameType } from '@/types';

interface CategoryCardProps {
  type: GameType;
  name: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
}

const categoryIcons: Record<GameType, { icon: React.ReactNode; bgColor: string; textColor: string }> = {
  numbers: {
    icon: <span className="text-xl font-bold">123</span>,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600',
  },
  weather: {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        <path d="M15 11c0-1.66-1.34-3-3-3s-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1c0 1-1.5 1.25-1.5 3.5h2c0-1.5 1.5-1.75 1.5-3.5z" />
      </svg>
    ),
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  house: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
  transport: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4-8v16m-4-4h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
  emotion: {
    icon: <span className="text-2xl">😊</span>,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
  },
};

export default function CategoryCard({ type, name, description, selected, onClick }: CategoryCardProps) {
  const { icon, bgColor, textColor } = categoryIcons[type];

  return (
    <button
      onClick={onClick}
      className={`category-card w-full text-left ${selected ? 'selected' : ''}`}
    >
      <div className={`icon-box ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}
