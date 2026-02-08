'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { TraceGameType } from '@/types';
import { playCorrectSound, playWrongSound, playSuccessSound } from '@/lib/sounds';

const validTypes: TraceGameType[] = ['arrows', 'shapes'];

// A pattern is a list of dot indices that should be connected
interface Pattern {
  name: string;
  dots: number[]; // Indices into grid (0-24 for 5x5)
}

// Grid layout (5x5):
//  0  1  2  3  4
//  5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24

// Arrow patterns - simple lines
const ARROW_PATTERNS: Pattern[] = [
  // Horizontal line (middle row, left to right)
  { name: 'line', dots: [10, 11, 12, 13, 14] },
  // Vertical line (middle column, top to bottom)
  { name: 'vertical', dots: [2, 7, 12, 17, 22] },
  // Diagonal line (top-left to bottom-right)
  { name: 'diagonal', dots: [0, 6, 12, 18, 24] },
  // L shape
  { name: 'L', dots: [2, 7, 12, 17, 22, 23, 24] },
];

// Shape patterns
const SHAPE_PATTERNS: Pattern[] = [
  // Small square (3x3 in center)
  { name: 'square', dots: [6, 7, 8, 13, 18, 17, 16, 11, 6] },
  // Triangle pointing down
  { name: 'triangle', dots: [2, 22, 4, 2] },
  // Plus sign
  { name: 'plus', dots: [2, 7, 12, 10, 11, 12, 14, 13, 12, 17, 22] },
  // Diamond
  { name: 'diamond', dots: [2, 8, 22, 16, 2] },
];

interface TraceGame {
  pattern: Pattern;
  gridSize: number;
  userPath: number[];
  currentStep: number;
}

function initGame(gameType: TraceGameType, stage: number): TraceGame {
  const patterns = gameType === 'arrows' ? ARROW_PATTERNS : SHAPE_PATTERNS;
  const patternIndex = (stage - 1) % patterns.length;

  return {
    pattern: patterns[patternIndex],
    gridSize: 5,
    userPath: [],
    currentStep: 0,
  };
}

// Get x,y coordinates from index
function indexToCoords(index: number, gridSize: number): { x: number; y: number } {
  return {
    x: index % gridSize,
    y: Math.floor(index / gridSize),
  };
}

// Draw SVG path from dots
function dotsToPath(dots: number[], gridSize: number, cellSize: number, padding: number): string {
  if (dots.length < 2) return '';

  const points = dots.map(idx => {
    const { x, y } = indexToCoords(idx, gridSize);
    return {
      x: padding + x * cellSize + cellSize / 2,
      y: padding + y * cellSize + cellSize / 2,
    };
  });

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  return path;
}

export default function TraceClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const type = params.type as string;

  const [game, setGame] = useState<TraceGame | null>(null);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showError, setShowError] = useState(false);

  const gameType = validTypes.includes(type as TraceGameType) ? (type as TraceGameType) : null;

  const startGame = useCallback((newStage: number = 1) => {
    if (gameType) {
      setGame(initGame(gameType, newStage));
      setStage(newStage);
      setShowCompletion(false);
      setShowError(false);
    }
  }, [gameType]);

  useEffect(() => {
    setMounted(true);
    if (!gameType) {
      router.push(`/${locale}/categories`);
      return;
    }
    startGame(1);
  }, [gameType, locale, router, startGame]);

  const handleDotClick = (index: number) => {
    if (!game || showCompletion) return;

    const expectedDot = game.pattern.dots[game.currentStep];

    if (index === expectedDot) {
      // Correct dot
      if (soundEnabled) playCorrectSound();

      const newPath = [...game.userPath, index];
      const newStep = game.currentStep + 1;

      // Check if pattern complete
      if (newStep >= game.pattern.dots.length) {
        setGame({ ...game, userPath: newPath, currentStep: newStep });
        setScore(score + 10);
        if (soundEnabled) setTimeout(playSuccessSound, 200);
        setShowCompletion(true);
      } else {
        setGame({ ...game, userPath: newPath, currentStep: newStep });
      }

      setShowError(false);
    } else {
      // Wrong dot
      if (soundEnabled) playWrongSound();
      setShowError(true);
      // Reset progress
      setGame({ ...game, userPath: [], currentStep: 0 });
    }
  };

  const handleNextStage = () => {
    startGame(stage + 1);
  };

  const handleChooseAnother = () => {
    router.push(`/${locale}/categories`);
  };

  if (!gameType || !mounted || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-gray-400 text-xl">Loading...</div>
      </div>
    );
  }

  const gridSize = game.gridSize;
  const cellSize = 70;
  const padding = 30;
  const svgSize = gridSize * cellSize + padding * 2;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack />

      <main className="flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 mb-6 max-w-4xl mx-auto w-full shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-gray-600">{t('game.stage')}:</div>
              <div className="bg-teal-100 rounded-2xl px-6 py-3">
                <span className="text-2xl font-bold text-teal-700">{stage}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg text-gray-500">Очки</div>
              <div className="text-3xl font-bold text-teal-600">{score}</div>
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
                {t('trace.success')}
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
                  className="w-full py-4 px-6 text-teal-600 font-medium text-xl hover:bg-teal-50 rounded-xl transition-colors"
                >
                  {t('game.chooseAnother')}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6">
              {/* Instructions */}
              <p className="text-center text-2xl text-gray-700 mb-2">
                Повторите рисунок по точкам
              </p>
              <p className="text-center text-lg text-gray-500 mb-4">
                Нажимайте точки по порядку, начиная с зелёной
              </p>

              {showError && (
                <p className="text-center text-xl text-red-500 mb-4 font-bold">
                  ❌ Неправильно! Начните сначала.
                </p>
              )}

              {/* Progress */}
              <div className="text-center mb-4">
                <span className="text-xl text-teal-600 font-bold">
                  {game.currentStep} / {game.pattern.dots.length}
                </span>
              </div>

              {/* Two panels: Pattern and User input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pattern to copy (left) */}
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Образец</h3>
                  <div className="bg-gray-100 rounded-3xl p-2">
                    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                      {/* Grid dots */}
                      {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                        const { x, y } = indexToCoords(idx, gridSize);
                        const cx = padding + x * cellSize + cellSize / 2;
                        const cy = padding + y * cellSize + cellSize / 2;
                        const isInPattern = game.pattern.dots.includes(idx);
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r={isInPattern ? 12 : 8}
                            fill={isInPattern ? '#0D9488' : '#D1D5DB'}
                          />
                        );
                      })}

                      {/* Pattern path */}
                      <path
                        d={dotsToPath(game.pattern.dots, gridSize, cellSize, padding)}
                        stroke="#0D9488"
                        strokeWidth={5}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Start marker */}
                      {game.pattern.dots.length > 0 && (() => {
                        const startIdx = game.pattern.dots[0];
                        const { x, y } = indexToCoords(startIdx, gridSize);
                        const cx = padding + x * cellSize + cellSize / 2;
                        const cy = padding + y * cellSize + cellSize / 2;
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={18} fill="#22C55E" />
                            <text x={cx} y={cy + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">1</text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* User input (right) */}
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Ваш рисунок</h3>
                  <div className="bg-gray-100 rounded-3xl p-2">
                    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                      {/* User path */}
                      {game.userPath.length > 1 && (
                        <path
                          d={dotsToPath(game.userPath, gridSize, cellSize, padding)}
                          stroke="#22C55E"
                          strokeWidth={5}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Clickable dots */}
                      {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                        const { x, y } = indexToCoords(idx, gridSize);
                        const cx = padding + x * cellSize + cellSize / 2;
                        const cy = padding + y * cellSize + cellSize / 2;

                        const isInPath = game.userPath.includes(idx);
                        const isNext = game.pattern.dots[game.currentStep] === idx;
                        const isStart = game.currentStep === 0 && isNext;

                        let fillColor = '#D1D5DB'; // gray
                        if (isInPath) fillColor = '#22C55E'; // green
                        else if (isNext) fillColor = '#0D9488'; // teal

                        return (
                          <g
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className="cursor-pointer"
                          >
                            {/* Pulse animation for next dot */}
                            {isNext && !isInPath && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={24}
                                fill="none"
                                stroke={isStart ? '#22C55E' : '#0D9488'}
                                strokeWidth={3}
                                className="animate-ping"
                                opacity={0.5}
                              />
                            )}
                            {/* Ring for next */}
                            {isNext && !isInPath && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r={20}
                                fill={isStart ? '#22C55E20' : '#0D948820'}
                                stroke={isStart ? '#22C55E' : '#0D9488'}
                                strokeWidth={3}
                              />
                            )}
                            {/* The dot */}
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isInPath || isNext ? 14 : 10}
                              fill={fillColor}
                            />
                            {/* Number on completed dots */}
                            {isInPath && (
                              <text
                                x={cx}
                                y={cy + 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="12"
                                fontWeight="bold"
                              >
                                {game.userPath.indexOf(idx) + 1}
                              </text>
                            )}
                            {/* Start label */}
                            {isStart && (
                              <text
                                x={cx}
                                y={cy + 40}
                                textAnchor="middle"
                                fill="#22C55E"
                                fontSize="16"
                                fontWeight="bold"
                              >
                                СТАРТ
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
