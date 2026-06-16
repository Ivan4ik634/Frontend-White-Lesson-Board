'use client';

import { Button } from '@/components/ui/button';
import { PAGES } from '@/configs/PAGES';
import { Link } from '@/i18n/navigation';
import { useTheme } from '@/store/useTheme';
import Cookies from 'js-cookie';
import { Moon, Sun, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LandingHeader() {
  const isAuth = Cookies.get('auth') === 'true' || null;
  const t = useTranslations('landing');
  const auth = useTranslations('auth');
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 bg-stone-50/75 dark:bg-stone-900/75 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="../Logo.png" className="h-10 w-10 object-cover" />
          <span className="text-lg font-semibold tracking-tight ">Claro</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuth === true ? (
            <Button className="h-10 gap-2 rounded-lg  px-4 text-sm font-medium shadow-sm transition ">
              <Link href={PAGES.HOME}>{t('toHome')}</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-lg px-4 text-sm font-medium  transition  ">
                <Link href={PAGES.LOGIN}>{auth('login')}</Link>
              </Button>
              <Button
                asChild
                className="h-10 gap-2 rounded-lg  px-4 text-sm font-medium shadow-sm transition ">
                <Link href={PAGES.REGISTER}>
                  <UserPlus className="size-4" aria-hidden />
                  {auth('register')}
                </Link>
              </Button>
            </div>
          )}
          <Button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            variant="ghost"
            className="h-12 px-4  rounded-lg  text-sm font-medium  transition ">
            {theme === 'light' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  );
}
