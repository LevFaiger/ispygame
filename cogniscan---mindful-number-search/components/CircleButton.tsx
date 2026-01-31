
import React from 'react';
import { CircleItem, HouseConfig, TransportType } from '../types';
import { HouseIcon } from './HouseIcon';
import { TransportIcon } from './TransportIcon';

interface CircleButtonProps {
  item: CircleItem;
  onClick: (id: string) => void;
  disabled: boolean;
}

export const CircleButton: React.FC<CircleButtonProps> = ({ item, onClick, disabled }) => {
  const isNumber = typeof item.value === 'number';
  const isHouse = typeof item.value === 'object' && item.value !== null && 'windows' in item.value;
  const isTransport = typeof item.value === 'string' && ['car', 'bus', 'plane', 'bike', 'train', 'boat'].includes(item.value);

  return (
    <button
      onClick={() => !disabled && !item.isFound && onClick(item.id)}
      disabled={disabled || item.isFound}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: `rotate(${item.rotation}deg)`,
        zIndex: item.zIndex,
      }}
      className={`
        absolute w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center 
        transition-all duration-300 ease-out active:scale-90
        ${item.isFound 
          ? 'bg-green-50 scale-95 opacity-50 grayscale' 
          : 'bg-transparent text-slate-900 hover:bg-slate-50'
        }
      `}
    >
      {isHouse ? (
        <HouseIcon config={item.value as HouseConfig} className={item.isFound ? 'text-green-600' : 'text-slate-900'} />
      ) : isTransport ? (
        <TransportIcon type={item.value as TransportType} className={item.isFound ? 'text-green-600' : 'text-slate-900'} />
      ) : (
        <span className={`
          ${isNumber ? 'text-2xl md:text-3xl font-black font-mono' : 'text-3xl md:text-4xl'}
          ${item.isFound ? 'opacity-40' : 'opacity-100'}
        `}>
          {item.value as string}
        </span>
      )}
      
      {item.isFound && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-10 h-10 text-green-600 animate-in zoom-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
            </svg>
         </div>
      )}
    </button>
  );
};
