import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/sign-in", "/auth/sign-up", "/auth/callback"];
const WEBHOOK_PATH = /^\/api\/webhook\/.+/;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Handle the callback code
  const callbackCode = req.nextUrl.searchParams.get('code');
  if (callbackCode && req.nextUrl.pathname === '/') {
    // Redirect to the callback route with the code
    return NextResponse.redirect(new URL(`/auth/callback?code=${callbackCode}`, req.url));
  }

  // Allow webhook endpoints and callback to be accessed without authentication
  if (WEBHOOK_PATH.test(req.nextUrl.pathname) || req.nextUrl.pathname === '/auth/callback') {
    return res;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublicPath = PUBLIC_PATHS.includes(req.nextUrl.pathname);

  // Redirect authenticated users away from auth pages
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users to sign-in page
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};