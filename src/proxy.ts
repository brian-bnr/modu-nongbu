import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const USER_ONLY_PATTERNS = [
  /^\/products\/new$/,
  /^\/products\/[^/]+\/edit$/,
  /^\/jobs\/new$/,
  /^\/jobs\/[^/]+\/edit$/,
  /^\/drones\/(?!operators(\/|$)).+$/,
  /^\/my(\/.*)?$/,
];

const VISIT_COOKIE = "mn_vid";

function trackVisit(
  pathname: string,
  cookieValue: string | undefined,
  response: NextResponse,
  event: NextFetchEvent
) {
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

  let visitorId = cookieValue;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    response.cookies.set(VISIT_COOKIE, visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  const visitDate = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  event.waitUntil(
    prisma.visit
      .upsert({
        where: { visitorId_visitDate: { visitorId, visitDate } },
        update: {},
        create: { visitorId, visitDate },
      })
      .catch(() => {})
  );
}

function checkInvestorAuth(req: NextRequest): NextResponse | null {
  const expected = process.env.INVESTOR_PAGE_PASSWORD;
  if (!expected) return null;

  const authHeader = req.headers.get("authorization");
  const valid =
    !!authHeader &&
    authHeader.startsWith("Basic ") &&
    (() => {
      try {
        const decoded = atob(authHeader.slice(6));
        const password = decoded.slice(decoded.indexOf(":") + 1);
        return password === expected;
      } catch {
        return false;
      }
    })();

  if (valid) return null;

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Investors"' },
  });
}

export default auth((req, event: NextFetchEvent) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname === "/investors" || pathname.startsWith("/investors/")) {
    const challenge = checkInvestorAuth(req);
    if (challenge) return challenge;
  }

  let response: NextResponse;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const isAdmin = session?.user?.type === "admin";

    if (isLoginPage) {
      response = isAdmin
        ? NextResponse.redirect(new URL("/admin", req.nextUrl))
        : NextResponse.next();
    } else if (!isAdmin) {
      const loginUrl = new URL("/admin/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      response = NextResponse.redirect(loginUrl);
    } else {
      response = NextResponse.next();
    }
  } else if (pathname === "/login") {
    response =
      session?.user?.type === "user"
        ? NextResponse.redirect(new URL("/", req.nextUrl))
        : NextResponse.next();
  } else if (USER_ONLY_PATTERNS.some((pattern) => pattern.test(pathname))) {
    if (session?.user?.type !== "user") {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      response = NextResponse.redirect(loginUrl);
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  trackVisit(pathname, req.cookies.get(VISIT_COOKIE)?.value, response, event);

  return response;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt|xml)$).*)",
  ],
};
