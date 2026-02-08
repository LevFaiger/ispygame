'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { FindDiffGameType } from '@/types';
import { playCorrectSound, playWrongSound, playSuccessSound } from '@/lib/sounds';

const validTypes: FindDiffGameType[] = ['shoes', 'bears'];

// ============ SHOES GAME ============
type ShoeVariant = {
  direction: 'left' | 'right';
  laces: 'tied' | 'untied' | 'none';
  style: 'sneaker' | 'boot' | 'sandal';
};

interface ShoeItem {
  id: string;
  variant: ShoeVariant;
  isTarget: boolean;
  isFound: boolean;
}

function generateShoeVariant(): ShoeVariant {
  const directions: ('left' | 'right')[] = ['left', 'right'];
  const laces: ('tied' | 'untied' | 'none')[] = ['tied', 'untied', 'none'];
  const styles: ('sneaker' | 'boot' | 'sandal')[] = ['sneaker', 'boot', 'sandal'];

  return {
    direction: directions[Math.floor(Math.random() * directions.length)],
    laces: laces[Math.floor(Math.random() * laces.length)],
    style: styles[Math.floor(Math.random() * styles.length)],
  };
}

function variantsMatch(a: ShoeVariant, b: ShoeVariant): boolean {
  return a.direction === b.direction && a.laces === b.laces && a.style === b.style;
}

function initShoesGame(stage: number): { items: ShoeItem[]; targetVariant: ShoeVariant; targetCount: number } {
  const items: ShoeItem[] = [];
  const totalItems = 24 + stage * 6;
  const targetCount = 2;

  const targetVariant = generateShoeVariant();
  const itemsData: { isTarget: boolean; variant: ShoeVariant }[] = [];

  for (let i = 0; i < targetCount; i++) {
    itemsData.push({ isTarget: true, variant: targetVariant });
  }

  for (let i = targetCount; i < totalItems; i++) {
    let variant: ShoeVariant;
    do {
      variant = generateShoeVariant();
    } while (variantsMatch(variant, targetVariant));
    itemsData.push({ isTarget: false, variant });
  }

  for (let i = itemsData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itemsData[i], itemsData[j]] = [itemsData[j], itemsData[i]];
  }

  for (let i = 0; i < itemsData.length; i++) {
    items.push({
      id: `shoe-${i}`,
      variant: itemsData[i].variant,
      isTarget: itemsData[i].isTarget,
      isFound: false,
    });
  }

  return { items, targetVariant, targetCount };
}

function ShoeIcon({ variant, size = 'normal' }: { variant: ShoeVariant; size?: 'normal' | 'large' }) {
  const sizeClass = size === 'large' ? 'w-16 h-16' : 'w-12 h-12';
  const transform = variant.direction === 'left' ? 'scaleX(-1)' : '';
  const emoji = variant.style === 'sneaker' ? '👟' : variant.style === 'boot' ? '🥾' : '🩴';

  return (
    <div className={`${sizeClass} flex items-center justify-center`} style={{ transform }}>
      <span className={size === 'large' ? 'text-5xl' : 'text-3xl'}>{emoji}</span>
    </div>
  );
}

// ============ BEARS GAME ============
interface DiffSpot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  size: number; // percentage
  found: boolean;
}

// Bear with details that can differ
interface BearScene {
  hatColor: string;
  scarfColor: string;
  hasSnowflakes: boolean;
  hasStar: boolean;
  drumPattern: string;
  skateColor: string;
}

function initBearsGame(stage: number): { diffSpots: DiffSpot[]; leftScene: BearScene; rightScene: BearScene } {
  // Base scene
  const leftScene: BearScene = {
    hatColor: '#8B4513',
    scarfColor: '#228B22',
    hasSnowflakes: true,
    hasStar: false,
    drumPattern: 'zigzag',
    skateColor: '#4169E1',
  };

  // Scene with differences
  const rightScene: BearScene = {
    hatColor: '#DC143C', // Different hat color
    scarfColor: '#228B22',
    hasSnowflakes: true,
    hasStar: true, // Added star
    drumPattern: 'stripes', // Different pattern
    skateColor: '#4169E1',
  };

  // Difference spots - smaller, precise areas
  const diffSpots: DiffSpot[] = [
    { id: 'hat', x: 50, y: 18, size: 10, found: false },      // Hat only
    { id: 'star', x: 85, y: 8, size: 10, found: false },      // Star
    { id: 'drum', x: 50, y: 62, size: 10, found: false },     // Drum only
  ];

  // Add more spots for higher stages
  if (stage >= 2) {
    diffSpots.push({ id: 'scarf', x: 50, y: 45, size: 10, found: false });
    diffSpots.push({ id: 'skate', x: 50, y: 82, size: 10, found: false });
  }

  return { diffSpots, leftScene, rightScene };
}

// Simple Bear SVG component
function BearImage({ scene, onSpotClick, diffSpots, side }: {
  scene: BearScene;
  onSpotClick: (id: string) => void;
  diffSpots: DiffSpot[];
  side: 'left' | 'right';
}) {
  return (
    <div className="relative bg-blue-50 rounded-2xl p-4 w-full aspect-[3/4]">
      {/* Bear illustration using emojis and shapes */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Star (only on right if hasStar) */}
        {scene.hasStar && (
          <div className="absolute top-2 right-4 text-4xl">⭐</div>
        )}

        {/* Snowflakes */}
        {scene.hasSnowflakes && (
          <>
            <div className="absolute top-4 left-4 text-2xl opacity-60">❄️</div>
            <div className="absolute top-8 right-8 text-xl opacity-40">❄️</div>
            <div className="absolute top-16 left-8 text-lg opacity-50">❄️</div>
          </>
        )}

        {/* Hat */}
        <div
          className="text-5xl mb-1"
          style={{ color: scene.hatColor }}
        >
          🎩
        </div>

        {/* Bear face */}
        <div className="text-7xl">🐻</div>

        {/* Scarf */}
        <div
          className="text-4xl -mt-2"
          style={{ color: scene.scarfColor }}
        >
          🧣
        </div>

        {/* Drum */}
        <div className="text-5xl mt-2">
          {scene.drumPattern === 'zigzag' ? '🥁' : '🪘'}
        </div>

        {/* Skates */}
        <div className="text-4xl mt-2" style={{ color: scene.skateColor }}>
          ⛸️
        </div>
      </div>

      {/* Clickable difference spots (only on right side) */}
      {side === 'right' && diffSpots.map((spot) => (
        <button
          key={spot.id}
          onClick={() => onSpotClick(spot.id)}
          className={`absolute rounded-full transition-all border-4
            ${spot.found
              ? 'border-green-500 bg-transparent'
              : 'border-transparent hover:border-rose-300 active:border-rose-400'
            }
          `}
          style={{
            left: `${spot.x - spot.size/2}%`,
            top: `${spot.y - spot.size/2}%`,
            width: `${spot.size}%`,
            height: `${spot.size}%`,
          }}
          disabled={spot.found}
        />
      ))}
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function FindDiffClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const type = params.type as string;

  // Shoes game state
  const [shoeItems, setShoeItems] = useState<ShoeItem[]>([]);
  const [targetVariant, setTargetVariant] = useState<ShoeVariant | null>(null);

  // Bears game state
  const [diffSpots, setDiffSpots] = useState<DiffSpot[]>([]);
  const [leftScene, setLeftScene] = useState<BearScene | null>(null);
  const [rightScene, setRightScene] = useState<BearScene | null>(null);

  // Common state
  const [stage, setStage] = useState(1);
  const [foundCount, setFoundCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  const gameType = validTypes.includes(type as FindDiffGameType) ? (type as FindDiffGameType) : null;

  const startGame = useCallback((newStage: number = 1) => {
    if (gameType === 'shoes') {
      const { items, targetVariant: newTarget, targetCount: count } = initShoesGame(newStage);
      setShoeItems(items);
      setTargetVariant(newTarget);
      setTargetCount(count);
    } else if (gameType === 'bears') {
      const { diffSpots: spots, leftScene: left, rightScene: right } = initBearsGame(newStage);
      setDiffSpots(spots);
      setLeftScene(left);
      setRightScene(right);
      setTargetCount(spots.length);
    }
    setFoundCount(0);
    setStage(newStage);
    setShowCompletion(false);
  }, [gameType]);

  useEffect(() => {
    setMounted(true);
    if (!gameType) {
      router.push(`/${locale}/categories`);
      return;
    }
    startGame(1);
  }, [gameType, locale, router, startGame]);

  const handleShoeClick = (id: string) => {
    const item = shoeItems.find(i => i.id === id);
    if (!item || item.isFound) return;

    if (item.isTarget) {
      if (soundEnabled) playCorrectSound();
      const newItems = shoeItems.map(i => i.id === id ? { ...i, isFound: true } : i);
      setShoeItems(newItems);
      const newFoundCount = foundCount + 1;
      setFoundCount(newFoundCount);
      if (newFoundCount >= targetCount) {
        if (soundEnabled) setTimeout(playSuccessSound, 200);
        setShowCompletion(true);
      }
    } else {
      if (soundEnabled) playWrongSound();
    }
  };

  const handleSpotClick = (id: string) => {
    const spot = diffSpots.find(s => s.id === id);
    if (!spot || spot.found) return;

    if (soundEnabled) playCorrectSound();
    const newSpots = diffSpots.map(s => s.id === id ? { ...s, found: true } : s);
    setDiffSpots(newSpots);
    const newFoundCount = foundCount + 1;
    setFoundCount(newFoundCount);
    if (newFoundCount >= targetCount) {
      if (soundEnabled) setTimeout(playSuccessSound, 200);
      setShowCompletion(true);
    }
  };

  const handleNextStage = () => {
    startGame(stage + 1);
  };

  const handleChooseAnother = () => {
    router.push(`/${locale}/categories`);
  };

  if (!gameType || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-gray-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack />

      <main className="flex-1 flex flex-col p-4">
        {/* Header with counter */}
        <div className="bg-white rounded-3xl p-6 mb-6 max-w-4xl mx-auto w-full shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-gray-600">{t('game.target')}:</div>
              {gameType === 'shoes' && targetVariant && (
                <div className="flex gap-2 bg-rose-100 rounded-2xl p-4">
                  <ShoeIcon variant={targetVariant} size="large" />
                  <ShoeIcon variant={{ ...targetVariant, direction: targetVariant.direction === 'left' ? 'right' : 'left' }} size="large" />
                </div>
              )}
              {gameType === 'bears' && (
                <div className="bg-amber-100 rounded-2xl px-6 py-3">
                  <span className="text-2xl">🐻 Найди отличия</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg text-gray-500">{t('game.found')}</div>
              <div className="text-3xl font-bold text-rose-600">{foundCount} / {targetCount}</div>
            </div>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex justify-end mb-4 max-w-4xl mx-auto w-full">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-xl bg-white hover:bg-gray-100 transition-colors text-2xl"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center">
          {showCompletion ? (
            <div className="card text-center max-w-md p-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">✓</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {t('game.excellent')}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('finddiff.success')}
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleNextStage}
                  className="btn-primary w-full text-xl py-4"
                >
                  {t('game.nextStage')}
                </button>
                <button
                  onClick={handleChooseAnother}
                  className="w-full py-4 px-6 text-rose-600 font-medium text-xl hover:bg-rose-50 rounded-xl transition-colors"
                >
                  {t('game.chooseAnother')}
                </button>
              </div>
            </div>
          ) : gameType === 'shoes' ? (
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6">
              <div className="grid grid-cols-6 gap-3">
                {shoeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleShoeClick(item.id)}
                    className={`p-3 rounded-xl transition-all cursor-pointer active:scale-95
                      ${item.isFound ? 'bg-green-200 ring-4 ring-green-400' : 'bg-gray-100 hover:bg-rose-100 hover:scale-105'}
                    `}
                    disabled={item.isFound}
                    type="button"
                  >
                    <ShoeIcon variant={item.variant} />
                  </button>
                ))}
              </div>
            </div>
          ) : gameType === 'bears' && leftScene && rightScene ? (
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6">
              <p className="text-center text-xl text-gray-600 mb-4">
                Нажмите на отличие на правой картинке
              </p>
              <div className="grid grid-cols-2 gap-4">
                <BearImage
                  scene={leftScene}
                  onSpotClick={() => {}}
                  diffSpots={[]}
                  side="left"
                />
                <BearImage
                  scene={rightScene}
                  onSpotClick={handleSpotClick}
                  diffSpots={diffSpots}
                  side="right"
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
