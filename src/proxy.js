import { NextResponse } from 'next/server';

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('authToken');

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register', '/forgot-password', '/unauthorized'];
  const isPublic = publicRoutes.some(p => pathname.startsWith(p));
  
  // Auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password', '/unauthorized'].some(p => pathname.startsWith(p));
  // 1️⃣ Not logged in & accessing non-public → redirect to home
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2️⃣ Logged in & trying to access login/register/forgot → redirect home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
