import { locales } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';
import FindDiffClient from '@/components/FindDiffClient';

const findDiffTypes = ['shoes', 'bears'];

export function generateStaticParams() {
  const params: { locale: string; type: string }[] = [];
  for (const locale of locales) {
    for (const type of findDiffTypes) {
      params.push({ locale, type });
    }
  }
  return params;
}

export default async function FindDiffPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FindDiffClient />;
}
