import { locales } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';
import MazeClient from '@/components/MazeClient';

const mazeTypes = ['keys', 'threads'];

export function generateStaticParams() {
  const params: { locale: string; type: string }[] = [];
  for (const locale of locales) {
    for (const type of mazeTypes) {
      params.push({ locale, type });
    }
  }
  return params;
}

export default async function MazePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MazeClient />;
}
