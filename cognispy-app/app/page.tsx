'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for stored locale preference
    const storedLocale = localStorage.getItem('cognispy_locale');
    const locale = storedLocale || defaultLocale;
    router.replace(`/${locale}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
}
