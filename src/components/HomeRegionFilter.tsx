"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@/components/icons/NavIcons";

export function HomeRegionFilter({ regions }: { regions: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(region: string) {
    setIsOpen(false);
    router.push(`/products?region=${encodeURIComponent(region)}`);
  }

  return (
    <div className="mt-6 flex items-center gap-2 rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
      <span className="shrink-0 font-medium text-black/70 dark:text-white/70">
        우리 지역 농산물 보기
      </span>
      <div ref={containerRef} className="relative w-32 sm:w-40">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-md border border-black/10 px-3 py-1.5 text-left dark:border-white/10"
        >
          <span className="truncate text-black/70 dark:text-white/70">지역 선택</span>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 text-black/40 transition dark:text-white/40 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-neutral-900">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSelect(r)}
                className="block w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/10"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
