'use client';

import { MainCategory } from '@/types';

interface MainCategoryCardProps {
  category: MainCategory;
  name: string;
  subtitle?: string; // Optional, not displayed in 70+ UX
  character: string;
  keyword: string;
  onClick: () => void;
  disabled?: boolean;
}

// Simple, consistent icons - one grandpa style, one grandma style
const categoryStyles: Record<MainCategory, { icon: string; bgColor: string; hoverBg: string }> = {
  ispy: {
    icon: '👴🔍',
    bgColor: 'bg-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
  },
  finddiff: {
    icon: '👵👀',
    bgColor: 'bg-rose-600',
    hoverBg: 'hover:bg-rose-700',
  },
  trace: {
    icon: '👵✏️',
    bgColor: 'bg-teal-600',
    hoverBg: 'hover:bg-teal-700',
  },
  maze: {
    icon: '👴🧭',
    bgColor: 'bg-amber-600',
    hoverBg: 'hover:bg-amber-700',
  },
};

export default function MainCategoryCard({
  category,
  name,
  character,
  keyword,
  onClick,
  disabled = false,
}: MainCategoryCardProps) {
  const { icon, bgColor, hoverBg } = categoryStyles[category];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full rounded-3xl p-8 text-white text-center
        ${bgColor} ${!disabled ? hoverBg : ''}
        transition-all duration-200
        ${!disabled ? 'hover:shadow-2xl cursor-pointer active:scale-95' : 'opacity-50 cursor-not-allowed'}
        shadow-lg
      `}
    >
      {/* Large icon - always visible with text */}
      <div className="text-7xl mb-6">{icon}</div>

      {/* Large, clear name */}
      <h3 className="text-3xl font-bold mb-2">{name}</h3>

      {/* Character name - large font */}
      <p className="text-xl mb-4">{character}</p>

      {/* Keyword action - clear and large */}
      <div className="bg-white/20 rounded-full py-3 px-6 inline-block">
        <span className="text-xl font-medium">{keyword}</span>
      </div>

      {disabled && (
        <p className="mt-4 text-lg opacity-80">Скоро</p>
      )}
    </button>
  );
}
