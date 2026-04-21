import { NextRequest, NextResponse } from "next/server";
import { stack } from "./stack";

export async function proxy(request: NextRequest) {
  const user = await stack.getUser();
  const { pathname } = request.nextUrl;

  // Protect the dashboard/workspace routes
  if (pathname.startsWith("/workspace") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect away from login if already authenticated
  if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && user) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/login", "/signup"],
};
