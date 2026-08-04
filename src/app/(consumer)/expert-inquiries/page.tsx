import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/Badge";

const SAMPLE_INQUIRIES = [
  { title: "농약 사용법 문의", detail: "벼멸구 방제 시기와 적정 살포량이 궁금해요.", date: "오늘", status: "신규" as const },
  { title: "병해충 진단 요청", detail: "잎에 반점이 생겼는데 어떤 병인지 봐주실 수 있나요?", date: "오늘", status: "신규" as const },
  { title: "비료 추천 문의", detail: "이 시기에 맞는 비료 배합을 추천해주세요.", date: "어제", status: "답변완료" as const },
];

const STATUS_VARIANT = { 신규: "amber", 답변완료: "green" } as const;

export default async function ExpertInquiriesPreviewPage() {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/expert-inquiries");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">상담·문의</h1>
      <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
        전문가 상담·문의 연결 기능을 준비하고 있어요. 아래는 서비스가 열리면 어떻게 보일지 보여주는
        예시 화면입니다.
      </p>

      <ul className="mt-6 space-y-2">
        {SAMPLE_INQUIRIES.map((item) => (
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
