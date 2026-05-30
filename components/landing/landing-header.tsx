'use client';

import { Button } from '@/components/ui/button';
import { PAGES } from '@/configs/PAGES';
import Cookies from 'js-cookie';
import { BookOpenCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function LandingHeader() {
  const isAuth = Cookies.get('auth') === 'true' || false;
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
            <BookOpenCheck className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-950">Claro</span>
        </Link>

        {isAuth ? (
          <Button
            asChild
            className="h-10 gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
            <Link href={PAGES.HOME}>To home</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-lg px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
              <Link href={PAGES.LOGIN}>Login</Link>
            </Button>
            <Button
              asChild
              className="h-10 gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
              <Link href={PAGES.REGISTER}>
                <UserPlus className="size-4" aria-hidden />
                Register
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
