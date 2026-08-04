export type BarListItem = {
  key: string;
  label: string;
  value: number;
  icon?: string;
  colorClass?: string;
};

export function BarList({ items }: { items: BarListItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="space-y-3.5">
      {items.map((item, i) => (
        <li key={item.key} className="text-sm">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 font-medium">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-black/60 dark:text-white/60">
              {item.value.toLocaleString("ko-KR")}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className={`animate-bar-grow-x h-full rounded-full ${item.colorClass ?? "bg-brand-600"}`}
              style={{
                width: `${Math.max(item.value > 0 ? 3 : 0, (item.value / max) * 100)}%`,
                animationDelay: `${i * 70}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
