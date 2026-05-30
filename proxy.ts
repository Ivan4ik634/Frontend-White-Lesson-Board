import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const isAuth = request.cookies.get('auth')?.value === 'true' || false;
  const { pathname } = request.nextUrl;
  if (
    !isAuth &&
    pathname !== '/' &&
    pathname !== '/login' &&
    pathname !== '/callback/google' &&
    pathname !== '/register'
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    isAuth &&
    (pathname === '/login' || pathname === '/register' || pathname === '/callback/google')
  ) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/register', '/login', '/app', '/callback/google', '/board/:path*'],
};
