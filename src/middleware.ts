import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dashRoute, protectedRoutes, roleRoutes } from "./utils/userRoleRoutes";

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  const normalizedProtectedRoutes = protectedRoutes.map(normalizePath);

  if (normalizedProtectedRoutes.includes(pathname)) {
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

      const allowedRoutes = roleRoutes[userRole].map(normalizePath);

      if (!allowedRoutes.includes(pathname)) {
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

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken"; // Импортируем библиотеку для работы с JWT
// import { dashRoute, protectedRoutes, roleRoutes } from "./utils/userRoleRoutes";

// function normalizePath(path: string): string {
//   if (path.length > 1 && path.endsWith("/")) {
//     return path.slice(0, -1);
//   }
//   return path;
// }

// export async function middleware(request: NextRequest) {
//   const pathname = normalizePath(request.nextUrl.pathname);

//   const normalizedProtectedRoutes = protectedRoutes.map(normalizePath);

//   if (normalizedProtectedRoutes.includes(pathname)) {
//     const authToken = request.cookies.get("authToken");

//     if (!authToken) {
//       const loginUrl = new URL("/", request.url);
//       return NextResponse.redirect(loginUrl);
//     }

//     try {
//       const decoded = jwt.verify(authToken.value, process.env.JWT_SECRET as string) as unknown;

//       if (typeof decoded === 'object' && decoded !== null && 'role' in decoded) {
//         const userRole = (decoded as { role: string }).role;
        
//         if (!userRole) {
//           const loginUrl = new URL("/", request.url);
//           return NextResponse.redirect(loginUrl);
//         }

//         if (userRole === "developer") {
//           return NextResponse.next();
//         }
  
//         if (!roleRoutes[userRole]) {
//           const loginUrl = new URL("/", request.url);
//           return NextResponse.redirect(loginUrl);
//         }
  
//         const allowedRoutes = roleRoutes[userRole].map(normalizePath);
  
//         if (!allowedRoutes.includes(pathname)) {
//           const unauthorizedUrl = new URL(`${dashRoute}`, request.url);
//           return NextResponse.redirect(unauthorizedUrl);
//         }
  
//         return NextResponse.next();
//       } else {
//         throw new Error('Invalid token structure');
//       }
//     } catch (error) {
//       console.error("Token verification failed:", error);
//       const loginUrl = new URL("/", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }
