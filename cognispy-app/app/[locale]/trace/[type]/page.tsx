import { locales } from '@/i18n/config';
import { setRequestLocale } from 'next-intl/server';
import TraceClient from '@/components/TraceClient';

const traceTypes = ['arrows', 'shapes'];

export function generateStaticParams() {
  const params: { locale: string; type: string }[] = [];
  for (const locale of locales) {
    for (const type of traceTypes) {
      params.push({ locale, type });
    }
  }
  return params;
}

export default async function TracePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TraceClient />;
}
