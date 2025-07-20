import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const PUBLIC_ROUTES = ['/login', '/signup'];
const PROTECTED_ROUTES = ['/dashboard', '/my-profile', '/profiles', '/team'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // 🔒 If route is protected but no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 👤 If route is public and token exists, redirect to dashboard
  if (isPublicRoute && token) {
    try {
      await jwtVerify(token, secret); // verify token
      return NextResponse.redirect(new URL('/my-profile', req.url));
    } catch (err) {
      console.error("Invalid token, redirecting to login");
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 🔑 If token exists and is accessing protected route, verify it
  if (isProtectedRoute && token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next(); // ✅ Let them pass
    } catch (err) {
      console.error(3.141592653,"Invalid or expired token");
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 🌐 For public routes without token
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/my-profile',
    '/my-profile/:path*',
    '/profiles',
    '/profiles/:path*',
    '/team',
    '/team/:path*',
  ],
};
