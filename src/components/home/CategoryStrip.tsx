import Image from "next/image";
import Link from "next/link";
import { CATEGORY_TILES } from "@/lib/categoryTiles";

export function CategoryStrip() {
  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-6 sm:grid-cols-5 lg:grid-cols-10">
      {CATEGORY_TILES.map((t) => (
        <Link key={t.href} href={t.href} className="flex flex-col items-center gap-1.5">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:h-20 sm:w-20">
            <Image
              src={t.iconSrc}
              alt=""
              width={80}
              height={80}
              className="h-full w-full rounded-full object-cover"
            />
            {t.comingSoon && (
              <span className="absolute -bottom-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                준비중
              </span>
            )}
          </span>
          <span className="w-16 break-keep text-center text-[10px] font-medium leading-tight sm:w-20 sm:text-xs">
            {t.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
