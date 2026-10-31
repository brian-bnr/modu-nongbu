"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setRegionAction } from "@/lib/actions/region";
import { ChevronDownIcon, MapPinIcon } from "@/components/icons/NavIcons";

export function RegionPicker({ current, regions }: { current: string; regions: string[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const region = e.target.value;
    startTransition(async () => {
      await setRegionAction(region);
      router.refresh();
    });
  }

  return (
    <label
      className={`relative flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 sm:text-sm ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <MapPinIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      <span className="max-w-20 truncate sm:max-w-28">{current || "지역 선택"}</span>
      <ChevronDownIcon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
      <select
        value={current}
        onChange={handleChange}
        disabled={isPending}
        aria-label="동네 설정"
        className="absolute inset-0 h-full w-full cursor-pointer text-black opacity-0"
      >
        <option value="">지역 선택</option>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </label>
  );
}
