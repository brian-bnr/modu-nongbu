import type { Metadata } from "next";
import { Gowun_Batang, Gowun_Dodum } from "next/font/google";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  variable: "--font-title",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-body",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mdfarm.co.kr"),
  title: "모두의농부",
  description: "전국 농가의 농산물을 찾고 농민에게 직접 구매요청을 보내는 플랫폼",
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
      className={`${gowunBatang.variable} ${gowunDodum.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
