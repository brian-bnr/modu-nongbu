import Image from "next/image";
import { getHeaderBarClass } from "@/lib/seasonalTheme";

export function Footer() {
  return (
    <footer
      className={`${getHeaderBarClass()} px-4 py-4 text-center text-white sm:px-8 sm:py-8 sm:text-left`}
    >
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
            <p>대표 : 윤지환 · 전화 : 1600-5252</p>
            <p>주소 : 인천광역시 서해구 중봉대로 490, 353호(청라더리브티아모, 청라동)</p>
            <p>사업자등록번호 : 580-81-01218</p>
            <p>통신판매업신고 : 제2024-인천강화-0074호</p>
            <p>개인정보관리책임자 : 윤지환 · 이메일 : ceo@bnrworld.co.kr</p>
          </div>

          <p className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>상호명 : 주식회사 비앤알월드</span>
            <span className="text-white/40">|</span>
            <span>주소 : 인천광역시 서해구 중봉대로 490, 353호(청라더리브티아모, 청라동)</span>
            <span className="text-white/40">|</span>
            <span>대표 : 윤지환</span>
            <span className="text-white/40">|</span>
            <span>전화 : 1600-5252</span>
            <span className="text-white/40">|</span>
            <span>사업자등록번호 : 580-81-01218</span>
          </p>

          <p className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-x-2">
            <span>통신판매업신고 : 제2024-인천강화-0074호</span>
            <span className="text-white/40">|</span>
            <span>개인정보관리책임자 : 윤지환</span>
            <span className="text-white/40">|</span>
            <span>이메일 : ceo@bnrworld.co.kr</span>
          </p>

          <p className="mt-0.5 text-white/50 sm:mt-0">
            © All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
