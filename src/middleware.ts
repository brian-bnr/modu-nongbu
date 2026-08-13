import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const USER_ONLY_PATTERNS = [
  /^\/products\/new$/,
  /^\/products\/[^/]+\/edit$/,
  /^\/jobs\/new$/,
  /^\/jobs\/[^/]+\/edit$/,
  /^\/drones\/(?!operators(\/|$)).+$/,
  /^\/my(\/.*)?$/,
];

const VISIT_COOKIE = "mn_vid";

// 알려진 봇/크롤러/스캐너 User-Agent 패턴. 이런 요청은 방문자로 집계하지 않는다.
// ELB-HealthChecker: ALB 대상 그룹 헬스체크가 쿠키 없이 "/"를 주기적으로 반복
// 호출하면서 매번 새 방문자로 잡혀 방문자 수를 크게 부풀리는 주요 원인이었다.
const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|bytespider|petalbot|mj12bot|ahrefsbot|semrushbot|dotbot|scanner|python-requests|curl\/|wget\/|headless|phantomjs|scrapy|go-http-client|libwww-perl|httpclient|okhttp|postmanruntime|masscan|nmap|nikto|sqlmap|zgrab|yeti|daumoa|facebookexternalhit|kakaotalk-scrap|whatsapp|telegram|healthcheck|elb-health|pingdom|uptimerobot|statuscake|site24x7/i;

function isPrefetchRequest(req: NextRequest) {
  // Next.js가 화면에 보이는 <Link>를 백그라운드로 미리 불러올 때 보내는 요청.
  // 실제 페이지뷰가 아니므로 방문자로 집계하면 안 된다. 쿠키가 없는 첫 방문자의
  // 경우 이런 프리페치 요청이 쿠키 저장 전에 동시에 여러 개 날아가면서 매번 새
  // 방문자 ID가 발급돼 방문자 수가 크게 부풀려지는 원인이 된다.
  return (
    req.headers.get("next-router-prefetch") === "1" ||
    req.headers.get("purpose") === "prefetch" ||
    req.headers.get("sec-purpose")?.includes("prefetch") === true
  );
}

function trackVisit(
  pathname: string,
  cookieValue: string | undefined,
  response: NextResponse,
  event: NextFetchEvent,
  origin: string,
  userAgent: string,
  clientIp: string
) {
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
  // 실제 브라우저는 항상 User-Agent를 보낸다. 헬스체크/모니터링 봇처럼
  // UA가 비어있는 요청은 사람의 방문이 아니므로 집계에서 제외한다.
  if (!userAgent || BOT_UA_PATTERN.test(userAgent)) return;

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

  // 미들웨어는 Edge 런타임에서 실행돼 Prisma Client를 직접 쓸 수 없다.
  // Node.js 런타임에서 도는 Route Handler를 대신 호출해 DB에 기록한다.
  event.waitUntil(
    fetch(`${origin}/api/track-visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, visitDate, clientIp }),
    }).catch((err) => console.error("[trackVisit] fetch failed", err))
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

  if (!isPrefetchRequest(req)) {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    trackVisit(
      pathname,
      req.cookies.get(VISIT_COOKIE)?.value,
      response,
      event,
      req.nextUrl.origin,
      req.headers.get("user-agent") ?? "",
      clientIp
    );
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt|xml)$).*)",
  ],
};
