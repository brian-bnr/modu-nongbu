import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { approveNicepayPayment, derivePayMethod, verifyNicepaySignature } from "@/lib/nicepay";
import { getRequestOrigin } from "@/lib/request-domain";

// 나이스페이 인증 결과가 브라우저를 통해 이 URL로 POST(form-urlencoded)됩니다.
// (AUTHNICE.requestPay의 returnUrl로 지정)
export async function POST(request: Request) {
  const form = await request.formData();
  const authResultCode = String(form.get("authResultCode") ?? "");
  const authResultMsg = String(form.get("authResultMsg") ?? "");
  const tid = String(form.get("tid") ?? "");
  const clientId = String(form.get("clientId") ?? "");
  const orderId = String(form.get("orderId") ?? "");
  const amount = Number(form.get("amount") ?? "");
  const signature = String(form.get("signature") ?? "");
  const authToken = String(form.get("authToken") ?? "");

  // orderId 형식: "RSV-{reservationId}-{timestamp}" 또는 "ADDL-{reservationId}-{timestamp}"
  const [orderKind, reservationId] = orderId.split("-");
  const redirectUrl = new URL(
    reservationId ? `/drones/${reservationId}` : "/drones",
    getRequestOrigin(request)
  );

  if (authResultCode !== "0000") {
    redirectUrl.searchParams.set("payError", authResultMsg || "결제 인증에 실패했습니다.");
    return NextResponse.redirect(redirectUrl, 303);
  }

  if (
    !reservationId ||
    !tid ||
    !Number.isFinite(amount) ||
    clientId !== process.env.NEXT_PUBLIC_NICEPAY_CLIENT_ID ||
    !verifyNicepaySignature({ authToken, clientId, amount, signature })
  ) {
    redirectUrl.searchParams.set("payError", "결제 검증에 실패했습니다.");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const reservation = await prisma.droneReservation.findUnique({
    where: { id: reservationId },
    include: { payment: true },
  });

  if (!reservation) {
    redirectUrl.searchParams.set("payError", "예약을 찾을 수 없습니다.");
    return NextResponse.redirect(redirectUrl, 303);
  }

  try {
    if (orderKind === "RSV") {
      if (reservation.status !== "REQUESTED" || amount !== reservation.totalPrice) {
        throw new Error("결제 금액 또는 예약 상태가 올바르지 않습니다.");
      }

      const approved = await approveNicepayPayment(tid, amount);
      const method = derivePayMethod(approved);

      await prisma.$transaction([
        prisma.payment.create({
          data: {
            reservationId: reservation.id,
            amount,
            method,
            status: "HELD",
            isMock: false,
            pgTransactionId: tid,
            pgOrderId: orderId,
          },
        }),
        prisma.droneReservation.update({
          where: { id: reservation.id },
          data: { status: "PAID" },
        }),
      ]);
    } else if (orderKind === "ADDL") {
      if (
        !reservation.payment ||
        reservation.payment.additionalPaid ||
        amount !== reservation.payment.additionalAmount
      ) {
        throw new Error("추가 결제 금액이 올바르지 않습니다.");
      }

      await approveNicepayPayment(tid, amount);

      await prisma.payment.update({
        where: { reservationId: reservation.id },
        data: { additionalPaid: true, additionalPgTransactionId: tid, additionalPgOrderId: orderId },
      });
    } else {
      throw new Error("알 수 없는 결제 유형입니다.");
    }
  } catch (error) {
    console.error("NICEPAY 승인 처리 실패:", error);
    // 승인에 실패한 인증 건은 결제(승인)가 발생하지 않은 상태이므로 별도 취소는 불필요합니다.
    redirectUrl.searchParams.set(
      "payError",
      error instanceof Error ? error.message : "결제 승인에 실패했습니다."
    );
    return NextResponse.redirect(redirectUrl, 303);
  }

  redirectUrl.searchParams.set("paid", "1");
  return NextResponse.redirect(redirectUrl, 303);
}
