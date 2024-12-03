import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { dashRoute, protectedRoutes, roleRoutes } from "./utils/userRoleRoutes";

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

async function verifyToken(token: string, secret: string) {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}

export async function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  const normalizedProtectedRoutes = protectedRoutes.map(normalizePath);

  if (normalizedProtectedRoutes.includes(pathname)) {
    const authToken = request.cookies.get("authToken");

    if (!authToken) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = await verifyToken(authToken.value, process.env.JWT_SECRET as string) as unknown;

      if (typeof decoded === 'object' && decoded !== null && 'role' in decoded) {
        const userRole = (decoded as { role: string }).role.toLowerCase();
        
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
  
        const allowedRoutes = roleRoutes[userRole].map(normalizePath);
  
        if (!allowedRoutes.includes(pathname)) {
          const unauthorizedUrl = new URL(`${dashRoute}`, request.url);
          return NextResponse.redirect(unauthorizedUrl);
        }
  
        return NextResponse.next();
      } else {
        throw new Error('Invalid token structure');
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
