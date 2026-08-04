import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/Badge";

const SAMPLE_DEALS = [
  { title: "쌀 20톤 구매 문의", detail: "정기 납품용으로 대량 구매를 검토하고 있어요.", date: "오늘", status: "검토중" as const },
  { title: "계약재배 협의 요청", detail: "다음 시즌 계약재배 조건을 협의하고 싶어요.", date: "오늘", status: "협의중" as const },
  { title: "정기 납품 제안", detail: "매월 정기 납품 계약을 제안드립니다.", date: "어제", status: "협의중" as const },
  { title: "농산물 샘플 요청", detail: "품질 확인을 위한 샘플을 받아보고 싶어요.", date: "2일 전", status: "완료" as const },
];

const STATUS_VARIANT = { 검토중: "amber", 협의중: "blue", 완료: "green" } as const;

export default async function CompanyDealsPreviewPage() {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/company-deals");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">구매·계약 요청</h1>
      <p className="mt-2 rounded-lg bg-purple-50 p-3 text-sm text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
        업체 구매·계약재배 연결 기능을 준비하고 있어요. 아래는 서비스가 열리면 어떻게 보일지
        보여주는 예시 화면입니다.
      </p>

      <ul className="mt-6 space-y-2">
        {SAMPLE_DEALS.map((item) => (
          <li
            key={item.title}
            className="rounded-lg border border-black/10 p-4 dark:border-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-black/50 dark:text-white/50">{item.date}</p>
                <p className="mt-1 font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">{item.detail}</p>
              </div>
              <Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
