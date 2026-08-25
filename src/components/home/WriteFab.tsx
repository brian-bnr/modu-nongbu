import Link from "next/link";
import { PencilIcon } from "@/components/icons/NavIcons";

export function WriteFab() {
  return (
    <Link
      href="/products/new"
      aria-label="글쓰기"
      className="fixed bottom-20 right-4 z-40 flex items-center gap-1.5 rounded-full bg-brand-700 py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-800 sm:hidden"
    >
      <PencilIcon className="h-4 w-4" />
      글쓰기
    </Link>
  );
}
