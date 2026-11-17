import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale proxy (Next.js 16 renamed `middleware` → `proxy`).
 *
 * English is served unprefixed at the site root; Spanish is served under `/es`.
 * For `/es/*` requests we rewrite to the underlying English route and tag the
 * request with `x-locale: es` so pages/components can pick Spanish content. An
 * explicit `/en/*` is redirected to the canonical unprefixed path to avoid
 * duplicate URLs. Studio, API and static assets are excluded via the matcher.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/es" ? "/" : pathname.slice(3);
    const headers = new Headers(request.headers);
    headers.set("x-locale", "es");
    return NextResponse.rewrite(url, { request: { headers } });
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set("x-locale", "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    // Run on everything except API routes, Next internals, the Sanity Studio,
    // metadata files, and anything with a file extension (static assets).
    "/((?!api|_next/static|_next/image|studio|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
