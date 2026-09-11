"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    AUTHNICE?: {
      requestPay: (options: {
        clientId: string;
        method: string;
        orderId: string;
        amount: number;
        goodsName: string;
        buyerName?: string;
        buyerTel?: string;
        buyerEmail?: string;
        returnUrl: string;
        fnError?: (result: { errorMsg?: string }) => void;
      }) => void;
    };
  }
}

const NICEPAY_CLIENT_ID = process.env.NEXT_PUBLIC_NICEPAY_CLIENT_ID;

type PayMethod = "card" | "kakaopay";

const PAY_METHOD_OPTIONS: { value: PayMethod; label: string }[] = [
  { value: "card", label: "카드" },
  { value: "kakaopay", label: "카카오페이" },
];

type Props = {
  reservationId: string;
  orderKind: "RSV" | "ADDL";
  amount: number;
  goodsName: string;
  buyerName?: string;
  buyerTel?: string;
  buyerEmail?: string;
  label: string;
};

export function NicepayPayButton({
  reservationId,
  orderKind,
  amount,
  goodsName,
  buyerName,
  buyerTel,
  buyerEmail,
  label,
}: Props) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState<PayMethod>("card");

  useEffect(() => {
    if (scriptLoaded || scriptError) return;
    const timer = window.setTimeout(() => {
      if (!window.AUTHNICE) setScriptError(true);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [scriptLoaded, scriptError]);

  const handlePay = () => {
    if (!NICEPAY_CLIENT_ID) {
      alert("결제 기능이 아직 설정되지 않았습니다. 관리자에게 문의해주세요.");
      return;
    }
    if (!window.AUTHNICE) {
      alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    setIsPaying(true);
    const orderId = `${orderKind}-${reservationId}-${Date.now()}`;
    window.AUTHNICE.requestPay({
      clientId: NICEPAY_CLIENT_ID,
      method,
      orderId,
      amount,
      goodsName,
      buyerName,
      buyerTel,
      buyerEmail,
      returnUrl: `${window.location.origin}/api/payments/nicepay/return`,
      fnError: (result) => {
        setIsPaying(false);
        alert(result?.errorMsg ?? "결제 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <div>
      <Script
        src="https://pay.nicepay.co.kr/v1/js/"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptError(false);
          setScriptLoaded(true);
        }}
        onError={() => setScriptError(true)}
      />
      <div className="mb-2 flex gap-2">
        {PAY_METHOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMethod(option.value)}
            disabled={isPaying}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
              method === option.value
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-black/10 text-black/70 hover:border-brand-700 dark:border-white/20 dark:text-white/70"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {scriptError && !scriptLoaded && (
        <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          결제 모듈을 불러오지 못했습니다. 광고 차단 확장 프로그램이나 보안 프로그램이
          결제 스크립트를 막고 있을 수 있어요. 꺼두시거나 다른 브라우저에서 시도해보시고,
          아래 버튼으로 다시 불러와주세요.
          <button
            type="button"
            onClick={() => {
              setScriptError(false);
              window.location.reload();
            }}
            className="mt-2 block w-full rounded-md border border-red-300 bg-white px-3 py-1.5 font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-900/30"
          >
            새로고침해서 다시 시도
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handlePay}
        disabled={isPaying || !scriptLoaded}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPaying ? "결제 진행 중..." : !scriptLoaded && !scriptError ? "결제 모듈 불러오는 중..." : label}
      </button>
    </div>
  );
}
