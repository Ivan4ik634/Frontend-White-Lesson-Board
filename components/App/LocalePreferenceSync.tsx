'use client';

import { useProfile } from '@/hooks/useProfile';
import { usePathname, useRouter } from '@/i18n/navigation';
import { isLocale, type Locale } from '@/i18n/routing';
import Cookies from 'js-cookie';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export default function LocalePreferenceSync() {
  const { profile } = useProfile();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!profile?.language || !isLocale(profile.language)) return;

    Cookies.set('CLARO_LOCALE', profile.language, { expires: 365 });
    Cookies.set('NEXT_LOCALE', profile.language, { expires: 365 });

    if (profile.language !== locale) {
      router.replace(pathname, { locale: profile.language as Locale });
    }
  }, [locale, pathname, profile?.language, router]);

  return null;
}
