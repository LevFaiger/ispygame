'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import TargetDisplay from '@/components/TargetDisplay';
import { GameType, GameState } from '@/types';
import { initGame, createInitialGameState } from '@/lib/game-logic';
import { playCorrectSound, playWrongSound, playSuccessSound } from '@/lib/sounds';

const validGameTypes: GameType[] = ['numbers', 'weather', 'house', 'transport'];

export default function GameClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const type = params.type as string;

  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [showCompletion, setShowCompletion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  const gameType = validGameTypes.includes(type as GameType) ? (type as GameType) : null;

  const startGame = useCallback((stage: number = 1) => {
    if (!gameType) return;
    const newState = initGame(gameType, stage);
    setGameState(prev => ({ ...prev, ...newState }));
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

  const handleCircleClick = useCallback((id: string) => {
    setGameState(prev => {
      const circle = prev.circles.find(c => c.id === id);
      if (!circle || circle.isFound || !prev.isGameActive) return prev;

      if (circle.isTarget) {
        if (soundEnabled) playCorrectSound();

        const newCircles = prev.circles.map(c =>
          c.id === id ? { ...c, isFound: true } : c
        );
        const newFoundCount = prev.foundCount + 1;
        const isComplete = newFoundCount >= prev.totalTargetCount;

        if (isComplete) {
          if (soundEnabled) setTimeout(playSuccessSound, 200);
          setShowCompletion(true);
        }

        return {
          ...prev,
          circles: newCircles,
          foundCount: newFoundCount,
          score: prev.score + 10,
          isGameActive: !isComplete,
          endTime: isComplete ? Date.now() : prev.endTime,
        };
      } else {
        if (soundEnabled) playWrongSound();
        return {
          ...prev,
          score: Math.max(0, prev.score - 5),
        };
      }
    });
  }, [soundEnabled]);

  const handleNextStage = () => {
    startGame(gameState.currentStage + 1);
  };

  const handleChooseAnother = () => {
    router.push(`/${locale}/categories`);
  };

  const getRandomEncouragement = (): string => {
    const encouragements = t.raw('encouragements') as string[];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  const getStageName = (): string => {
    if (!gameType) return '';

    if (gameType === 'numbers') {
      const stageKey = String(Math.min(gameState.currentStage, 3));
      return t(`stages.numbers.${stageKey}`);
    }

    if (gameType === 'weather') {
      const stageKey = String(Math.min(gameState.currentStage, 5));
      return t(`stages.weather.${stageKey}`);
    }

    return `${t(`stages.${gameType}`)} ${gameState.currentStage}`;
  };

  if (!gameType) {
    return null;
  }

  if (!mounted || gameState.circles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-gray-400">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack />

      <main className="flex-1 flex flex-col p-4">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-2xl mx-auto w-full">
          <div className="stat-box">
            <div className="stat-label">{t('game.target')}</div>
            <TargetDisplay
              gameType={gameType}
              targetValue={gameState.targetValue}
              stage={gameState.currentStage}
            />
          </div>
          <div className="stat-box">
            <div className="stat-label">{t('game.found')}</div>
            <div className="stat-value text-indigo-600">
              {gameState.foundCount} / {gameState.totalTargetCount}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">{t('game.activity')}</div>
            <div className="stat-value text-sm">
              {getStageName().toUpperCase()}
            </div>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex justify-end mb-4 max-w-2xl mx-auto w-full">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? (
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex items-center justify-center">
          {showCompletion ? (
            <div className="card text-center max-w-md">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {t('game.excellent')}
              </h2>
              <p className="text-gray-600 mb-8">
                {getRandomEncouragement()}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleNextStage}
                  className="btn-primary w-full"
                >
                  {t('game.nextStage')}
                </button>
                <button
                  onClick={handleChooseAnother}
                  className="w-full py-3 px-6 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  {t('game.chooseAnother')}
                </button>
              </div>
            </div>
          ) : (
            <GameBoard
              circles={gameState.circles}
              onCircleClick={handleCircleClick}
            />
          )}
        </div>
      </main>
    </div>
  );
}
