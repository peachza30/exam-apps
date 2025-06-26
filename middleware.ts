import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { refresh } from "@/config/refresh-token";

const locales = ['en', 'th'] as const;
const defaultLocale = 'en';

type Locale = typeof locales[number];

// Determine user's preferred locale
function getLocale(request: NextRequest): Locale {
  try {
    const acceptedLanguage = request.headers.get('accept-language') ?? '';
    const headers = { 'accept-language': acceptedLanguage };
    const languages = new Negotiator({ headers }).languages();
    const matched = match(languages, locales, defaultLocale);

    return matched as Locale;
  } catch (error) {
    console.error('Locale detection error:', error);
    return defaultLocale;
  }
}

// Decode and check if JWT token is expired
function isJwtExpired(token: string): boolean {
  if (!token || typeof token !== 'string') return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payloadBase64 = parts[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

    console.log("Token payload:", {
      exp: payload.exp,
      iat: payload.iat,
      userId: payload.sub || payload.userId
    });

    if (!payload.exp || typeof payload.exp !== 'number') return true;

    const now = Math.floor(Date.now() / 1000);
    const buffer = 30; // 30 second buffer for clock skew

    return payload.exp < (now + buffer);
  } catch (err) {
    console.error('JWT validation error:', err);
    return true;
  }
}

// Refresh token function - you'll need to implement this based on your API
async function refreshToken(token: string): Promise<string | null> {
  try {
    const response = await refresh(token)

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return data.accessToken || data.token || null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

// Extract locale from pathname
function getLocaleFromPathname(pathname: string): Locale | null {
  const locale = locales.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );
  return locale || null;
}

// Check if path should be protected
function isProtectedPath(pathname: string, locale: string): boolean {
  const protectedPaths = [
    `/${locale}/dashboard`,
    `/${locale}/profile`,
    `/${locale}/settings`,
  ];

  return protectedPaths.some(path =>
    pathname.startsWith(path) || pathname === path
  );
}

// Check if path is public (doesn't require auth)
function isPublicPath(pathname: string, locale: string): boolean {
  const publicPaths = [
    `/${locale}/login`,
    `/${locale}/register`,
    `/${locale}/forgot-password`,
    `/${locale}`, // Home page
    // Add more public routes here
  ];

  return publicPaths.some(path =>
    pathname === path || (path === `/${locale}` && pathname === `/${locale}`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.includes('/_next/') ||
    pathname.includes('/api/') ||
    pathname.includes('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Get authentication token
  const cookieName = process.env.NEXT_PUBLIC_COOKIES_NAME || '';
  const cookie = request.cookies.get(cookieName);
  const token = cookie?.value || '';
  console.log("token", token);

  console.log('Middleware - Path:', pathname, 'Has Token:', !!token);

  const locale = getLocaleFromPathname(pathname);
  console.log("locale", locale);


  // Handle missing locale - redirect to localized URL
  if (!locale) {
    const detectedLocale = getLocale(request);
    console.log("detectedLocale", detectedLocale);
    const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
    console.log("newUrl", newUrl);
    console.log('Redirecting to localized URL:', newUrl.href);
    return NextResponse.redirect(newUrl);
  }

  // If no cookie exists at all, redirect to login for protected paths
  if (!token) {
    const isRootLocale = pathname === `/${locale}`;

    // Explicitly redirect unauthenticated users from /en or /th to /en/login or /th/login
    if (isRootLocale) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isProtectedPath(pathname, locale)) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Token exists - check if it's expired and try to refresh
  let isLoggedIn = !isJwtExpired(token);
  let currentToken = token;

  // If token is expired, try to refresh it
  if (!isLoggedIn) {
    console.log('Token expired, attempting refresh...');
    try {
      const newToken = await refreshToken(token);
      if (newToken) {
        console.log('Token refreshed successfully');
        isLoggedIn = true;
        currentToken = newToken;

        // Create response and set the new token cookie
        const response = NextResponse.next();
        response.cookies.set(cookieName, newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        // Continue with the updated token
        console.log('Updated token in cookie');

        // Handle redirects for logged-in users
        if (pathname === `/${locale}/login` ||
          pathname === `/${locale}/register` ||
          pathname === `/${locale}/forgot-password`) {
          const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
          console.log('Redirecting refreshed user to dashboard:', dashboardUrl.href);
          return NextResponse.redirect(dashboardUrl);
        }

        // Redirect to dashboard if accessing root locale path
        if (pathname === `/${locale}`) {
          const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
          return NextResponse.redirect(dashboardUrl);
        }

        return response;
      } else {
        console.log('Token refresh failed');
        isLoggedIn = false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      isLoggedIn = false;
    }
  }

  // If still not logged in after refresh attempt, redirect to login for protected paths
  if (!isLoggedIn && isProtectedPath(pathname, locale)) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    if (pathname !== `/${locale}`) {
      loginUrl.searchParams.set('returnUrl', pathname);
    }
    console.log('Authentication failed, redirecting to login:', loginUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login/register pages
  if (isLoggedIn && (
    pathname === `/${locale}/login` ||
    pathname === `/${locale}/register` ||
    pathname === `/${locale}/forgot-password`
  )) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    console.log('Redirecting logged-in user to dashboard:', dashboardUrl.href);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect root locale path to dashboard if logged in
  if (isLoggedIn && pathname === `/${locale}`) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (images, stylesheets, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};