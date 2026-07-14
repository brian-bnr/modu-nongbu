import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-brand-900 px-4 py-8 text-center text-white sm:px-8 sm:text-left">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt=""
            width={36}
            height={36}
            quality={100}
            className="rounded-full bg-white/90 p-0.5"
          />
          <span className="text-xl font-bold">모두의농부</span>
        </div>

        <div className="space-y-2 text-sm text-white/70">
          <p className="font-semibold text-white">주식회사 비앤알월드</p>
          <p className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>대표자 윤지환</span>
            <span className="hidden sm:inline">|</span>
            <span>오시는길 인천광역시 서구 중봉대로 490 청라더리브티아모 353호(청라동)</span>
            <span className="hidden sm:inline">|</span>
            <span>대표번호 1600-5262</span>
          </p>
          <p className="text-white/50">Copyright ⓒ2025 by 주식회사 비앤알월드 ALL RIGHT RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
