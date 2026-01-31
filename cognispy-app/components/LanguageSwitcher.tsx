'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  const switchLocale = (newLocale: Locale) => {
    localStorage.setItem('cognispy_locale', newLocale);
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentLocale === locale
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
