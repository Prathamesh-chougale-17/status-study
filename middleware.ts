import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  
  // If no session cookie and trying to access protected routes, redirect to sign-in
  if (!sessionCookie && request.nextUrl.pathname !== '/sign-in') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // If has session cookie and trying to access sign-in page, redirect to dashboard
  if (sessionCookie && request.nextUrl.pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Temporarily disable middleware - only handle auth server-side
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
