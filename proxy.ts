import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function stripLocale(pathname: string) {
  const segments = pathname.split('/');
  const locale = segments[1];

  if (routing.locales.includes(locale as never)) {
    return `/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/';
  }

  return pathname;
}

export function proxy(request: NextRequest) {
  const isAuth = request.cookies.get('auth')?.value === 'true' || false;
  const preferredLocale = request.cookies.get('CLARO_LOCALE')?.value;
  if (preferredLocale && routing.locales.includes(preferredLocale as never)) {
    request.cookies.set('NEXT_LOCALE', preferredLocale);
  }

  const { pathname } = request.nextUrl;
  const pathWithoutLocale = stripLocale(pathname);

  if (
    !isAuth &&
    pathWithoutLocale !== '/' &&
    pathWithoutLocale !== '/login' &&
    pathWithoutLocale !== '/callback/google' &&
    pathWithoutLocale !== '/register'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(pathWithoutLocale, '/login');
    return NextResponse.redirect(url);
  }

  if (
    isAuth &&
    (pathWithoutLocale === '/login' ||
      pathWithoutLocale === '/register' ||
      pathWithoutLocale === '/callback/google')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(pathWithoutLocale, '/app');
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
