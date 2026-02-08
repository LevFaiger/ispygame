'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { MazeGameType } from '@/types';
import { playCorrectSound, playWrongSound, playSuccessSound } from '@/lib/sounds';

const validTypes: MazeGameType[] = ['keys', 'threads'];

// Line path connecting start to end
interface MazeLine {
  id: string;
  startIndex: number; // Which start item (0-based)
  endIndex: number;   // Which end item this connects to
  color: string;
}

interface MazeGame {
  startItems: string[];  // Emojis at the top
  endItems: string[];    // Emojis at the bottom
  lines: MazeLine[];
  targetStartIndex: number; // Which start item player needs to find path for
  correctEndIndex: number;  // The correct answer
}

const COLORS = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA'];

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function initKeysGame(stage: number): MazeGame {
  const numItems = Math.min(3 + Math.floor(stage / 2), 5);

  // Create connections (each start connects to exactly one end)
  const endIndices = shuffleArray([...Array(numItems).keys()]);

  const lines: MazeLine[] = [];
  for (let i = 0; i < numItems; i++) {
    lines.push({
      id: `line-${i}`,
      startIndex: i,
      endIndex: endIndices[i],
      color: COLORS[i % COLORS.length],
    });
  }

  const targetStartIndex = Math.floor(Math.random() * numItems);
  const correctEndIndex = endIndices[targetStartIndex];

  return {
    startItems: ['🔒'], // Lock at top (single)
    endItems: Array(numItems).fill('🔑'), // Keys at bottom
    lines,
    targetStartIndex: 0, // Always the lock
    correctEndIndex,
  };
}

function initThreadsGame(stage: number): MazeGame {
  const numItems = Math.min(3 + Math.floor(stage / 2), 5);

  const spools = ['🧵', '🪡', '🎀', '🧶', '🪢'];
  const balls = ['🔴', '🔵', '🟢', '🟠', '🟣'];

  const endIndices = shuffleArray([...Array(numItems).keys()]);

  const lines: MazeLine[] = [];
  for (let i = 0; i < numItems; i++) {
    lines.push({
      id: `line-${i}`,
      startIndex: i,
      endIndex: endIndices[i],
      color: COLORS[i % COLORS.length],
    });
  }

  const targetStartIndex = Math.floor(Math.random() * numItems);
  const correctEndIndex = endIndices[targetStartIndex];

  return {
    startItems: spools.slice(0, numItems),
    endItems: balls.slice(0, numItems),
    lines,
    targetStartIndex,
    correctEndIndex,
  };
}

// Generate SVG path for tangled line
function generateTangledPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  seed: number
): string {
  const midY = (startY + endY) / 2;
  const amplitude = 60 + (seed * 20) % 40;

  // Create bezier curve with some random curves
  const cp1x = startX + (seed % 2 === 0 ? amplitude : -amplitude);
  const cp1y = startY + (endY - startY) * 0.25;
  const cp2x = endX + (seed % 3 === 0 ? -amplitude : amplitude);
  const cp2y = startY + (endY - startY) * 0.75;

  // Add some loops
  const loopX = (startX + endX) / 2 + ((seed * 17) % 60) - 30;
  const loopY = midY;

  return `M ${startX} ${startY}
          C ${cp1x} ${cp1y}, ${loopX - 30} ${loopY - 20}, ${loopX} ${loopY}
          S ${cp2x} ${cp2y}, ${endX} ${endY}`;
}

export default function MazeClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const type = params.type as string;

  const [game, setGame] = useState<MazeGame | null>(null);
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  const gameType = validTypes.includes(type as MazeGameType) ? (type as MazeGameType) : null;

  const startGame = useCallback((newStage: number = 1) => {
    if (gameType === 'keys') {
      setGame(initKeysGame(newStage));
    } else if (gameType === 'threads') {
      setGame(initThreadsGame(newStage));
    }
    setStage(newStage);
    setSelectedAnswer(null);
    setShowResult(false);
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

  const handleAnswerClick = (index: number) => {
    if (showResult || !game) return;

    setSelectedAnswer(index);
    setShowResult(true);

    if (index === game.correctEndIndex) {
      if (soundEnabled) playCorrectSound();
      setScore(score + 10);
      setTimeout(() => {
        if (soundEnabled) playSuccessSound();
        setShowCompletion(true);
      }, 1000);
    } else {
      if (soundEnabled) playWrongSound();
    }
  };

  const handleNextStage = () => {
    startGame(stage + 1);
  };

  const handleRetry = () => {
    startGame(stage);
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

  const isKeys = gameType === 'keys';
  const numItems = game.endItems.length;
  const svgWidth = 400;
  const svgHeight = 300;
  const startY = 30;
  const endY = svgHeight - 30;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack />

      <main className="flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 mb-6 max-w-2xl mx-auto w-full shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-gray-600">{t('game.stage')}:</div>
              <div className="bg-amber-100 rounded-2xl px-6 py-3">
                <span className="text-2xl font-bold text-amber-700">{stage}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg text-gray-500">Счёт</div>
              <div className="text-3xl font-bold text-amber-600">{score}</div>
            </div>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex justify-end mb-4 max-w-2xl mx-auto w-full">
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
                {t('maze.success')}
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
                  className="w-full py-4 px-6 text-amber-600 font-medium text-xl hover:bg-amber-50 rounded-xl transition-colors"
                >
                  {t('game.chooseAnother')}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6">
              {/* Instructions */}
              <p className="text-center text-xl text-gray-600 mb-4">
                {isKeys
                  ? 'Какой ключ открывает замок? Проследите линию.'
                  : 'Куда ведёт нить? Проследите линию.'}
              </p>

              {/* Target indicator */}
              <div className="flex justify-center mb-4">
                <div className="bg-amber-100 rounded-2xl px-6 py-3 flex items-center gap-3">
                  <span className="text-2xl">Найдите путь от:</span>
                  <span className="text-4xl">
                    {isKeys ? '🔒' : game.startItems[game.targetStartIndex]}
                  </span>
                </div>
              </div>

              {/* Maze visualization */}
              <div className="relative flex flex-col items-center">
                {/* Start items */}
                <div className="flex justify-center gap-8 mb-2 z-10">
                  {isKeys ? (
                    <div className={`text-6xl p-3 rounded-2xl ${
                      showResult ? 'bg-amber-200' : 'bg-amber-100'
                    }`}>
                      🔒
                    </div>
                  ) : (
                    game.startItems.map((item, i) => (
                      <div
                        key={i}
                        className={`text-5xl p-2 rounded-xl ${
                          i === game.targetStartIndex
                            ? 'bg-amber-200 ring-4 ring-amber-400'
                            : 'bg-gray-100'
                        }`}
                      >
                        {item}
                      </div>
                    ))
                  )}
                </div>

                {/* SVG lines */}
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  className="my-2"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                  {game.lines.map((line, i) => {
                    const startX = isKeys
                      ? svgWidth / 2
                      : ((line.startIndex + 0.5) / numItems) * svgWidth;
                    const endX = ((line.endIndex + 0.5) / numItems) * svgWidth;

                    const isCorrectLine = isKeys
                      ? line.endIndex === game.correctEndIndex
                      : line.startIndex === game.targetStartIndex;

                    const showHighlight = showResult && isCorrectLine;

                    return (
                      <path
                        key={line.id}
                        d={generateTangledPath(startX, startY, endX, endY, i * 7 + game.targetStartIndex)}
                        stroke={showHighlight ? '#22C55E' : '#6B7280'}
                        strokeWidth={showHighlight ? 6 : 3}
                        fill="none"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* End items (clickable) */}
                <div className="flex justify-center gap-6 mt-2 z-10">
                  {game.endItems.map((item, i) => {
                    const isCorrect = i === game.correctEndIndex;
                    const isSelected = selectedAnswer === i;

                    let bgClass = 'bg-gray-100 hover:bg-amber-100';
                    if (showResult) {
                      if (isCorrect) {
                        bgClass = 'bg-green-200 ring-4 ring-green-500';
                      } else if (isSelected) {
                        bgClass = 'bg-red-200 ring-4 ring-red-500';
                      } else {
                        bgClass = 'bg-gray-100';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerClick(i)}
                        disabled={showResult}
                        className={`text-5xl p-3 rounded-2xl transition-all cursor-pointer active:scale-95 ${bgClass}`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Retry button if wrong */}
              {showResult && selectedAnswer !== game.correctEndIndex && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleRetry}
                    className="btn-primary text-xl py-3 px-8"
                  >
                    Попробовать снова
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
