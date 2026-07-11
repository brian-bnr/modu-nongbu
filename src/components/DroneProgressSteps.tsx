import type { DroneReservationStatus } from "@prisma/client";

const STEPS = [
  "방제 신청",
  "견적 확인",
  "선결제(에스크로)",
  "방제사 배정",
  "방제 수행",
  "완료 확인",
  "자동 정산",
  "완료",
];

const STATUS_TO_STEP: Partial<Record<DroneReservationStatus, number>> = {
  REQUESTED: 2,
  PAID: 3,
  ASSIGNED: 4,
  IN_PROGRESS: 5,
  COMPLETION_REQUESTED: 6,
  COMPLETED: 8,
};

export function DroneProgressSteps({ status }: { status: DroneReservationStatus }) {
  if (status === "CANCELLED" || status === "DISPUTED") {
    return (
      <div
        className={`rounded-lg border p-3 text-center text-sm font-medium ${
          status === "CANCELLED"
            ? "border-black/10 bg-black/5 text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
        }`}
      >
        {status === "CANCELLED" ? "취소된 예약입니다" : "이의제기가 접수되어 확인 중입니다"}
      </div>
    );
  }

  const currentStep = STATUS_TO_STEP[status] ?? 1;

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-start gap-1 px-1 py-2">
        {STEPS.map((label, i) => {
          const stepNumber = i + 1;
          const done = stepNumber < currentStep;
          const active = stepNumber === currentStep;
          return (
            <div key={label} className="flex items-center">
              <div className="flex w-16 flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? "bg-brand-700 text-white"
                      : active
                        ? "bg-brand-100 text-brand-800 ring-2 ring-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                        : "bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40"
                  }`}
                >
                  {done ? "✓" : stepNumber}
                </div>
                <p
                  className={`text-center text-[11px] leading-tight ${
                    active
                      ? "font-medium text-brand-800 dark:text-brand-300"
                      : "text-black/50 dark:text-white/50"
                  }`}
                >
                  {label}
                </p>
              </div>
              {stepNumber < STEPS.length && (
                <div
                  className={`mb-5 h-0.5 w-4 shrink-0 ${
                    done ? "bg-brand-700" : "bg-black/10 dark:bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
