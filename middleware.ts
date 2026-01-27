import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'tr', 'ru', 'ar', 'zh'],

    // Used when no locale matches
    defaultLocale: 'en'
});

export default async function middleware(request: NextRequest) {
    const response = handleI18nRouting(request);

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );

    return response;
}

export const config = {
    // Match only internationalized pathnames
    // matcher: ['/', '/(en|tr|ru|ar|zh)/:path*']
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
