import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PREFIXES = ["/login", "/api/auth/"];

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
      // Redirect already-authenticated users away from /login so they don't
      // see a bare login gate when they're already in a valid session.
      if (pathname.startsWith("/login")) {
        const token = req.cookies.get("site_token")?.value;
        if (token) {
          const payload = await verifyToken(token);
          if (payload) {
            const dest = req.nextUrl.searchParams.get("from") || "/";
            const url = req.nextUrl.clone();
            url.pathname = dest.startsWith("/") ? dest : "/";
            url.search = "";
            const res = NextResponse.redirect(url);
            res.headers.set("Cache-Control", "no-store");
            return res;
          }
        }
      }
      return NextResponse.next();
    }

    const token = req.cookies.get("site_token")?.value;

    if (!token) {
      return toLogin(req, pathname);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const res = toLogin(req, pathname);
      res.cookies.delete("site_token");
      res.cookies.delete("user_role");
      return res;
    }

    const response = NextResponse.next();
    response.headers.set("x-user-role", payload.role);
    // Prevent the browser from caching protected pages/assets
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch {
    // Fail closed — any unexpected error sends the user to login
    const res = toLogin(req, req.nextUrl.pathname);
    return res;
  }
}

function toLogin(req: NextRequest, from: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", from === "/login" ? "/" : from);
  const res = NextResponse.redirect(url);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: [
    /*
     * Protect every path EXCEPT the minimum needed for the login page to render:
     *   _next/static  — compiled JS/CSS bundles (login page needs these)
     *   _next/image   — Next.js image optimizer
     *   brand/        — logo displayed on the login page itself
     *   favicon.ico   — browser tab icon
     *   robots.txt / sitemap.xml
     *
     * Everything else — all pages, /images/*, /partenaires/*, /generated/*, etc.
     * — is caught by this matcher and verified against the JWT cookie.
     */
    "/((?!_next/static|_next/image|brand/|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
