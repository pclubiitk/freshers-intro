// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/team', // add any routes you want to protect
];

export function middleware(req: NextRequest) {

    const token = req.cookies.get('access_token'); // Get the cookie
    const { pathname } = req.nextUrl;

    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtected && !token) {
        // 👇 Redirect to login if no cookie
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // ✅ Allow access
    return NextResponse.next();
}

// Optional: matcher to only run middleware on needed paths
export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/team/:path*'],
};
