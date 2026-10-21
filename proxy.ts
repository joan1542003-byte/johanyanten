import { NextResponse, type NextRequest } from "next/server";

const locales = ["es", "en"];
const defaultLocale = "es";

function getLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header.split(",").map((l) => l.trim().slice(0, 2).toLowerCase());
  return preferred.find((l) => locales.includes(l)) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API, the admin panel and static files
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};
