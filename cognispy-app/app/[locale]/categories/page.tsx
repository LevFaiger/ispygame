import { locales } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';
import CategoriesClient from '@/components/CategoriesClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CategoriesClient />;
}
