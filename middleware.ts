import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

const roleDashboard: Record<Role, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

const protectedPrefixes: { prefix: string; role: Role }[] = [
  { prefix: "/dashboard/admin", role: "ADMIN" },
  { prefix: "/dashboard/provider", role: "PROVIDER" },
  { prefix: "/dashboard/customer", role: "CUSTOMER" },
];

const authPages = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value as Role | undefined;

  // Already logged in, trying to visit login/register -> send to own dashboard
  if (authPages.includes(pathname)) {
    if (token && role && roleDashboard[role]) {
      return NextResponse.redirect(
        new URL(roleDashboard[role], request.url)
      );
    }
    return NextResponse.next();
  }

  const matchedProtected = protectedPrefixes.find((p) =>
    pathname.startsWith(p.prefix)
  );

  if (matchedProtected) {
    // No token -> not logged in
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but wrong role -> send to login page
    if (role !== matchedProtected.role) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};