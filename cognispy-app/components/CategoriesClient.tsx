'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import { GameType } from '@/types';

const gameTypes: GameType[] = ['numbers', 'weather', 'house', 'transport', 'emotion', 'fruits'];

export default function CategoriesClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [username, setUsername] = useState<string>('');
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

  const handleCategorySelect = (type: GameType) => {
    setSelectedCategory(type);
    router.push(`/${locale}/game/${type}`);
  };

  if (!username) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header username={username} onSwitchUser={handleSwitchUser} />

      <main className="flex-1 flex flex-col items-center p-4 pt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
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
