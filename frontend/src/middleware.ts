import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const publicAuthRoutes = ['/login', '/signup'];
export async function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value;
    const { pathname } = req.nextUrl;
    const isPublicAuthRoute = publicAuthRoutes.includes(pathname);
    const isProtectedRoute = ['/dashboard', '/my-profile', '/settings', '/team'].some((route) =>
    pathname.startsWith(route)
    );
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isPublicAuthRoute && token) {
    return NextResponse.redirect(new URL('/my-profile', req.url));
    }
    if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
    }


    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (err) {
        console.error("Invalid token:", err);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/team/:path*'],
};
