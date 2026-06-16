import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'uk', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
  fr: 'Français',
};

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}
