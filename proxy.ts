import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ─── Role-based route protection rules ──────────────────────────────
// Maps path prefixes to the roles that are allowed to access them.
// `null` means "any authenticated user" (role doesn't matter).
const PROTECTED_ROUTES: { prefix: string; roles: string[] | null }[] = [
  { prefix: "/admin", roles: ["ADMINISTRATOR"] },
  { prefix: "/vendor", roles: ["PROFESSIONAL"] },
  { prefix: "/dashboard", roles: null }, // any logged-in user
  { prefix: "/profile", roles: null },
  { prefix: "/settings", roles: null },
  { prefix: "/favorites", roles: null },
  { prefix: "/payment", roles: null },
];

// Auth pages — redirect authenticated users away from login/register
const AUTH_PREFIX = "/auth";

// Public paths that should never be intercepted
// (handled by the matcher config below, but listed here for clarity)
const PUBLIC_PREFIXES = [
  "/api",
  "/_next",
  "/images",
  "/favicon.ico",
  "/manifest.json",
  "/sw.js",
  "/workbox-",
  "/offline",
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip public assets & API routes (belt-and-suspenders with matcher) ──
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Decode JWT from cookie (Edge-compatible, no Prisma needed) ──────────
  // Behind reverse proxies (like Vercel or Nginx), req.nextUrl.protocol might be 'http:'
  // even if the user visited via 'https:'. We explicitly tell getToken to look for
  // the secure '__Secure-authjs.session-token' cookie if appropriately deployed.
  const isProduction = process.env.NODE_ENV === "production";
  const secureCookie = isProduction || request.headers.get("x-forwarded-proto") === "https";

  const token = await getToken({
    req: request,
    secureCookie,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = (token?.role as string) || "";

  // ── Auth pages: redirect authenticated users to their dashboard ─────────
  if (pathname.startsWith(AUTH_PREFIX)) {
    if (isAuthenticated) {
      const dest = getRoleDashboard(userRole);
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // ── Protected routes: check auth + role ─────────────────────────────────
  for (const route of PROTECTED_ROUTES) {
    // Check for exact match or sub-path match (to avoid "/vendors" matching "/vendor")
    const isMatched = pathname === route.prefix || pathname.startsWith(route.prefix + "/");
    
    if (isMatched) {
      // Not logged in → redirect to auth with callback
      if (!isAuthenticated) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(
          new URL(`/auth?callbackUrl=${callbackUrl}`, request.url),
        );
      }

      // Logged in but wrong role → redirect to correct dashboard
      if (route.roles && !route.roles.includes(userRole)) {
        const dest = getRoleDashboard(userRole);
        return NextResponse.redirect(new URL(dest, request.url));
      }

      // Authorised — proceed
      return NextResponse.next();
    }
  }

  // ── All other pages are public ──────────────────────────────────────────
  return NextResponse.next();
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Map a user role to their default dashboard path */
function getRoleDashboard(role: string): string {
  switch (role) {
    case "ADMINISTRATOR":
      return "/admin";
    case "PROFESSIONAL":
      return "/vendor";
    default:
      return "/dashboard";
  }
}

// ── Matcher ─────────────────────────────────────────────────────────────────
// Only run middleware on pages/routes that might need protection.
// Excludes static files, images, API routes, and service worker assets.
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api/          (API routes — protected individually)
     * - _next/static/ (Next.js static files)
     * - _next/image/  (Next.js image optimisation)
     * - favicon.ico   (browser favicon)
     * - .*\\..*       (files with extensions like .png, .jpg, .js, .css)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)",
  ],
};
