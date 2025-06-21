import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request:NextRequest){
      console.log('🔐 Middleware running for:', request.nextUrl.pathname);
      const accessToken = request.cookies.get('accessToken');
      const protectedRoutes = [
            '/checkout',
            '/orders',
            '/profile',
            '/dashboard',
            '/cart/checkout',
          ];

      const isProtected = protectedRoutes.some(path =>
            request.nextUrl.pathname.startsWith(path)
          );
      
      if (isProtected && !accessToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('next', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
          }
      return NextResponse.next();
}

export const config = {
      matcher: [
        '/checkout/:path*',
        '/orders/:path*',
        '/profile',
        '/profile/:path*',
        '/dashboard/:path*',
        '/cart/checkout',
      ],
    };