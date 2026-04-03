import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getLocalesConfig } from "@/lib/i18n/locales";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const { locales, defaultLocale } = await getLocalesConfig();
  const segment = pathname.split("/").filter(Boolean)[0];

  if (segment && locales.includes(segment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const rest = pathname === "/" ? "" : pathname;
  url.pathname = `/${defaultLocale}${rest}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
