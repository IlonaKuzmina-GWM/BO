// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const authToken = request.cookies.get('authToken');

    // If no token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
