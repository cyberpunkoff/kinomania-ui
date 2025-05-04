import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession();
  const { pathname } = request.nextUrl;

  // Если пользователь не авторизован, то перенаправляем на страницу авторизации
  if (!session && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  // Стандартная авторизация
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Пути, которые не должны проходить через middleware
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo).*)",
  ],
};
