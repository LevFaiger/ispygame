import { locales } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';
import WelcomeClient from '@/components/WelcomeClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WelcomeClient />;
}
