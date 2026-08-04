import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-brand-600 px-4 py-4 text-center text-white sm:px-8 sm:py-8 sm:text-left">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Image
            src="/logo-icon.png"
            alt=""
            width={36}
            height={36}
            quality={100}
            className="h-6 w-6 rounded-full bg-white/90 p-0.5 sm:h-9 sm:w-9"
          />
          <span className="text-sm font-bold sm:text-xl">모두의농부</span>
        </div>

        <div className="text-[11px] text-white/70 sm:space-y-2 sm:text-sm">
          <p className="font-semibold text-white">주식회사 비앤알월드</p>

          <div className="mt-0.5 space-y-0.5 sm:hidden">
            <p>대표자 윤지환 · 대표번호 1600-5262</p>
            <p>오시는길 인천광역시 서구 중봉대로 490 청라더리브티아모 353호(청라동)</p>
          </div>

          <p className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>대표자 윤지환</span>
            <span className="text-white/40">|</span>
            <span>오시는길 인천광역시 서구 중봉대로 490 청라더리브티아모 353호(청라동)</span>
            <span className="text-white/40">|</span>
            <span>대표번호 1600-5262</span>
          </p>

          <p className="mt-0.5 text-white/50 sm:mt-0">
            Copyright ⓒ2025 by 주식회사 비앤알월드 ALL RIGHT RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
