

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // التأكد من أن اللغة مدعومة
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
  });


