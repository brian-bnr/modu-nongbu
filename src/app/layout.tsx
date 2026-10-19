import type { Metadata } from "next";
import { Gowun_Batang, Gowun_Dodum } from "next/font/google";
import "./globals.css";

// DESIGN.md 목표 타이포그래피: 제목은 Gowun Batang(세리프), 본문은 Gowun Dodum(산세리프).
// 둘 다 같은 "Gowun" 계열로 짝지어 설계되어 있고, Pretendard/시스템 기본 서체로 수렴하지 않는다.
const gowunBatang = Gowun_Batang({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "700",
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mdfarm.co.kr"),
  title: "모두의농부",
  description: "전국 농가의 농산물을 찾고 농민에게 직접 구매요청을 보내는 플랫폼",
  manifest: "/site.webmanifest",
  openGraph: {
    title: "모두의농부",
    description: "전국 농가의 농산물을 찾고 농민에게 직접 구매요청을 보내는 플랫폼",
    url: "https://www.mdfarm.co.kr",
    siteName: "모두의농부",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/kakao-app-icon.jpg",
        width: 1200,
        height: 1200,
        alt: "모두의농부 로고",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gowunDodum.variable} ${gowunBatang.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
