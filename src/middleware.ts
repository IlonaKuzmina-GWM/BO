// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dashRoute, roleRoutes } from "./utils/userRoleRoutes";

const protectedRoutes = [
  `${dashRoute}/`,
  `${dashRoute}/transactions`,
  `${dashRoute}/logs`,
  `${dashRoute}/siins`,
  `${dashRoute}/generateCSV`,
  `${dashRoute}/settlement`,
  `${dashRoute}/manager`,
  `${dashRoute}/settings`,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const authToken = request.cookies.get("authToken");

    if (!authToken) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const userRoleCookie = request.cookies.get("userRole");
      const userRole = userRoleCookie ? userRoleCookie.value : undefined;

      if (!userRole) {
        const loginUrl = new URL("/", request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (userRole === "developer") {
        return NextResponse.next();
      }

      if (!roleRoutes[userRole]) {
        const loginUrl = new URL("/", request.url);
        return NextResponse.redirect(loginUrl);
      }

      const allowedRoutes = roleRoutes[userRole];

      if (!allowedRoutes.some((route: string) => pathname.startsWith(route))) {
        const unauthorizedUrl = new URL(`${dashRoute}`, request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }

      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
