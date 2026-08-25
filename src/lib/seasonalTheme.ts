// 헤더/푸터 배경색: 평소엔 연한 브랜드 톤, 9/15~11/30(가을 시즌)엔 황금색으로 전환.
export function getHeaderBarClass(): string {
  const kstNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const year = kstNow.getFullYear();
  const autumnStart = new Date(year, 8, 15); // 9월 15일
  const autumnEnd = new Date(year, 10, 30, 23, 59, 59); // 11월 30일 자정까지

  const isAutumn = kstNow >= autumnStart && kstNow <= autumnEnd;
  return isAutumn ? "bg-accent-600" : "bg-brand-500";
}
