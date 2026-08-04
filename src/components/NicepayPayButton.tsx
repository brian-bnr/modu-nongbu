"use client";

import Script from "next/script";
import { useState } from "react";

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
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState<PayMethod>("card");

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
        onLoad={() => setScriptLoaded(true)}
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
      <button
        type="button"
        onClick={handlePay}
        disabled={isPaying || !scriptLoaded}
        className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPaying ? "결제 진행 중..." : label}
      </button>
    </div>
  );
}
