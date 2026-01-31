'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function WelcomeClient() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cognispy_username');
    if (stored) {
      setUsername(stored);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('cognispy_username', username.trim());
      router.push(`/${locale}/categories`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      {/* Welcome Card */}
      <div className="card w-full max-w-md text-center">
        {/* User Icon */}
        <div className="mx-auto w-20 h-20 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        {/* Greeting */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {t('welcome.greeting')}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('welcome.placeholder')}
            className="input-field"
            autoFocus
          />
          <button
            type="submit"
            disabled={!username.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('welcome.button')}
          </button>
        </form>
      </div>

      {/* App Title */}
      <p className="mt-8 text-gray-400 text-sm">
        {t('app.title')} - {t('app.tagline')}
      </p>
    </main>
  );
}
