import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const USER_ONLY_PATTERNS = [
  /^\/products\/new$/,
  /^\/products\/[^/]+\/edit$/,
  /^\/jobs\/new$/,
  /^\/jobs\/[^/]+\/edit$/,
  /^\/my(\/.*)?$/,
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const isAdmin = session?.user?.type === "admin";

    if (isLoginPage) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      }
      return NextResponse.next();
    }

    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (session?.user?.type === "user") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (USER_ONLY_PATTERNS.some((pattern) => pattern.test(pathname))) {
    if (session?.user?.type !== "user") {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/products/new",
    "/products/:id/edit",
    "/jobs/new",
    "/jobs/:id/edit",
    "/my/:path*",
  ],
};
