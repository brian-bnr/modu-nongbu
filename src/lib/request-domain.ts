// ALB 뒤에서 `next start`로 셀프호스팅 중인 환경에서는 request.url의 host가
// 실제 접속 도메인과 다르게 잡히는 경우가 있어(예: VWorld 인증키 오류, 나이스페이
// 결제 완료 리다이렉트가 localhost로 새는 문제), 운영 도메인이 고정된 AUTH_URL을
// 우선 사용하고 없을 때만 요청에서 유추한다.
export function getRequestDomain(request: Request): string {
  return new URL(getRequestOrigin(request)).hostname;
}

export function getRequestOrigin(request: Request): string {
  const authUrl = process.env.AUTH_URL;
  if (authUrl) {
    try {
      return new URL(authUrl).origin;
    } catch {
      // malformed AUTH_URL — fall through to request-derived origin
    }
  }
  return new URL(request.url).origin;
}
