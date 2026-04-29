import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_TMWP_APP_URL || "https://app.toulonwaterpolo.fr"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login/:path*",
  ],
};
