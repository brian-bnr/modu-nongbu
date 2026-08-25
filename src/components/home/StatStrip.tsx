type Stat = {
  label: string;
  value: number | null;
  suffix?: string;
};

function formatStat(stat: Stat) {
  if (stat.value === null || stat.value === 0) return "집계 준비중";
  return `${stat.value.toLocaleString("ko-KR")}${stat.suffix ?? ""}`;
}

export function StatStrip({
  farmerCount,
  completedDroneCount,
  weeklyPostCount,
}: {
  farmerCount: number;
  completedDroneCount: number;
  weeklyPostCount: number;
}) {
  const stats: Stat[] = [
    { label: "가입한 농민", value: farmerCount, suffix: "명" },
    { label: "완료된 방제 작업", value: completedDroneCount, suffix: "건" },
    { label: "이번 주 새 매물", value: weeklyPostCount, suffix: "건" },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-black/10 border-y border-black/10">
      {stats.map((stat) => (
        <div key={stat.label} className="px-2 py-4 text-center sm:py-6">
          <p className="text-xl font-bold tabular-nums text-brand-700 sm:text-3xl">
            {formatStat(stat)}
          </p>
          <p className="mt-1 break-keep text-[11px] text-black/50 sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
