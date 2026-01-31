'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  showBack?: boolean;
  username?: string;
  onSwitchUser?: () => void;
}

export default function Header({ showBack = false, username, onSwitchUser }: HeaderProps) {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleBack = () => {
    router.push(`/${locale}/categories`);
  };

  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('game.back')}
          </button>
        ) : username ? (
          <button
            onClick={onSwitchUser}
            className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
          >
            {username} ({t('welcome.switchUser')})
          </button>
        ) : null}
      </div>

      <h1 className="text-xl font-bold text-gray-800">{t('app.title')}</h1>

      <LanguageSwitcher />
    </header>
  );
}
