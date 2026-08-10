// ALB 뒤에서 `next start`로 셀프호스팅 중인 환경에서는 request.url의 host가
// 실제 접속 도메인과 다르게 잡히는 경우가 있어(예: VWorld 인증키 오류),
// 운영 도메인이 고정된 AUTH_URL을 우선 사용하고 없을 때만 요청에서 유추한다.
export function getRequestDomain(request: Request): string {
  const authUrl = process.env.AUTH_URL;
  if (authUrl) {
    try {
      return new URL(authUrl).hostname;
    } catch {
      // malformed AUTH_URL — fall through to request-derived hostname
    }
  }
  return new URL(request.url).hostname;
}
