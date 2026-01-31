import { locales } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';
import GameClient from '@/components/GameClient';

const gameTypes = ['numbers', 'weather', 'house', 'transport'];

export function generateStaticParams() {
  const params: { locale: string; type: string }[] = [];
  for (const locale of locales) {
    for (const type of gameTypes) {
      params.push({ locale, type });
    }
  }
  return params;
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GameClient />;
}
