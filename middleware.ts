import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Array of public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/callback',
  '/docs', // Add docs to public paths
  '/api/webhook/:id'
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/webhook/')) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith('/docs/')
  );

  if (isPublicPath) {
    return res;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and trying to access protected route, redirect to login
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};