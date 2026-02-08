'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import FindDiffCategoryCard from '@/components/FindDiffCategoryCard';
import MazeCategoryCard from '@/components/MazeCategoryCard';
import TraceCategoryCard from '@/components/TraceCategoryCard';
import MainCategoryCard from '@/components/MainCategoryCard';
import { GameType, MainCategory, FindDiffGameType, MazeGameType, TraceGameType } from '@/types';

const mainCategories: MainCategory[] = ['ispy', 'finddiff', 'trace', 'maze'];
const gameTypes: GameType[] = ['numbers', 'weather', 'house', 'transport', 'emotion', 'fruits', 'winter'];
const findDiffTypes: FindDiffGameType[] = ['shoes', 'bears'];
const mazeTypes: MazeGameType[] = ['keys', 'threads'];
const traceTypes: TraceGameType[] = ['arrows', 'shapes'];

export default function CategoriesClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [username, setUsername] = useState<string>('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GameType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cognispy_username');
    if (!stored) {
      router.push(`/${locale}`);
      return;
    }
    setUsername(stored);
  }, [locale, router]);

  const handleSwitchUser = () => {
    localStorage.removeItem('cognispy_username');
    router.push(`/${locale}`);
  };

  const handleMainCategorySelect = (category: MainCategory) => {
    setSelectedMainCategory(category);
  };

  const handleBackToMainCategories = () => {
    setSelectedMainCategory(null);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (type: GameType) => {
    setSelectedCategory(type);
    router.push(`/${locale}/game/${type}`);
  };

  const handleFindDiffSelect = (type: FindDiffGameType) => {
    router.push(`/${locale}/finddiff/${type}`);
  };

  const handleMazeSelect = (type: MazeGameType) => {
    router.push(`/${locale}/maze/${type}`);
  };

  const handleTraceSelect = (type: TraceGameType) => {
    router.push(`/${locale}/trace/${type}`);
  };

  if (!username) {
    return null;
  }

  // Show Trace sub-categories
  if (selectedMainCategory === 'trace') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header username={username} onSwitchUser={handleSwitchUser} />

        <main className="flex-1 flex flex-col items-center p-4 pt-8">
          {/* Trace Header */}
          <div className="w-full max-w-lg mb-8">
            <button
              onClick={handleBackToMainCategories}
              className="text-teal-600 hover:text-teal-800 mb-6 flex items-center gap-3 text-xl font-medium"
            >
              ← {t('game.back')}
            </button>
            <div className="bg-teal-600 rounded-3xl p-8 text-white text-center">
              <div className="text-7xl mb-4">👵✏️</div>
              <h2 className="text-3xl font-bold mb-2">{t('mainCategories.trace.character')}</h2>
              <p className="text-2xl">{t('mainCategories.trace.name')}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('categories.title')}
          </h2>

          <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {traceTypes.map((type) => (
              <TraceCategoryCard
                key={type}
                type={type}
                name={t(`trace.${type}.name`)}
                description={t(`trace.${type}.description`)}
                onClick={() => handleTraceSelect(type)}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show Maze sub-categories
  if (selectedMainCategory === 'maze') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header username={username} onSwitchUser={handleSwitchUser} />

        <main className="flex-1 flex flex-col items-center p-4 pt-8">
          {/* Maze Header */}
          <div className="w-full max-w-lg mb-8">
            <button
              onClick={handleBackToMainCategories}
              className="text-amber-600 hover:text-amber-800 mb-6 flex items-center gap-3 text-xl font-medium"
            >
              ← {t('game.back')}
            </button>
            <div className="bg-amber-600 rounded-3xl p-8 text-white text-center">
              <div className="text-7xl mb-4">👴🧭</div>
              <h2 className="text-3xl font-bold mb-2">{t('mainCategories.maze.character')}</h2>
              <p className="text-2xl">{t('mainCategories.maze.name')}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('categories.title')}
          </h2>

          <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {mazeTypes.map((type) => (
              <MazeCategoryCard
                key={type}
                type={type}
                name={t(`maze.${type}.name`)}
                description={t(`maze.${type}.description`)}
                onClick={() => handleMazeSelect(type)}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show Find Diff sub-categories
  if (selectedMainCategory === 'finddiff') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header username={username} onSwitchUser={handleSwitchUser} />

        <main className="flex-1 flex flex-col items-center p-4 pt-8">
          {/* Find Diff Header */}
          <div className="w-full max-w-lg mb-8">
            <button
              onClick={handleBackToMainCategories}
              className="text-rose-600 hover:text-rose-800 mb-6 flex items-center gap-3 text-xl font-medium"
            >
              ← {t('game.back')}
            </button>
            <div className="bg-rose-600 rounded-3xl p-8 text-white text-center">
              <div className="text-7xl mb-4">👵👀</div>
              <h2 className="text-3xl font-bold mb-2">{t('mainCategories.finddiff.character')}</h2>
              <p className="text-2xl">{t('mainCategories.finddiff.name')}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('categories.title')}
          </h2>

          <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {findDiffTypes.map((type) => (
              <FindDiffCategoryCard
                key={type}
                type={type}
                name={t(`finddiff.${type}.name`)}
                description={t(`finddiff.${type}.description`)}
                onClick={() => handleFindDiffSelect(type)}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show I Spy sub-categories
  if (selectedMainCategory === 'ispy') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header username={username} onSwitchUser={handleSwitchUser} />

        <main className="flex-1 flex flex-col items-center p-4 pt-8">
          {/* I Spy Header */}
          <div className="w-full max-w-lg mb-8">
            <button
              onClick={handleBackToMainCategories}
              className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-3 text-xl font-medium"
            >
              ← {t('game.back')}
            </button>
            <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center">
              <div className="text-7xl mb-4">👴🔍</div>
              <h2 className="text-3xl font-bold mb-2">{t('mainCategories.ispy.character')}</h2>
              <p className="text-2xl">{t('mainCategories.ispy.name')}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t('categories.title')}
          </h2>

          <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameTypes.map((type) => (
              <CategoryCard
                key={type}
                type={type}
                name={t(`categories.${type}.name`)}
                description={t(`categories.${type}.description`)}
                selected={selectedCategory === type}
                onClick={() => handleCategorySelect(type)}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show main categories
  return (
    <div className="min-h-screen flex flex-col">
      <Header username={username} onSwitchUser={handleSwitchUser} />

      <main className="flex-1 flex flex-col items-center p-4 pt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {t('mainCategories.title')}
        </h2>

        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainCategories.map((category) => (
            <MainCategoryCard
              key={category}
              category={category}
              name={t(`mainCategories.${category}.name`)}
              subtitle={t(`mainCategories.${category}.subtitle`)}
              character={t(`mainCategories.${category}.character`)}
              keyword={t(`mainCategories.${category}.keyword`)}
              onClick={() => handleMainCategorySelect(category)}
              disabled={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
