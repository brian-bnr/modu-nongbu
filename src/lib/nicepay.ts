import crypto from "crypto";

// 운영 전환 시 Vercel 환경변수 NICEPAY_ENV=production 으로 설정.
// (개발정보 탭에서 발급받은 클라이언트키/시크릿키도 운영용으로 함께 교체해야 함)
const API_BASE =
  process.env.NICEPAY_ENV === "production"
    ? "https://api.nicepay.co.kr"
    : "https://sandbox-api.nicepay.co.kr";

function requireEnv(name: "NEXT_PUBLIC_NICEPAY_CLIENT_ID" | "NICEPAY_SECRET_KEY"): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`나이스페이 연동 환경변수(${name})가 설정되지 않았습니다.`);
  }
  return value;
}

function authHeader(): string {
  const clientKey = requireEnv("NEXT_PUBLIC_NICEPAY_CLIENT_ID");
  const secretKey = requireEnv("NICEPAY_SECRET_KEY");
  const token = Buffer.from(`${clientKey}:${secretKey}`).toString("base64");
  return `Basic ${token}`;
}

export function verifyNicepaySignature(params: {
  authToken: string;
  clientId: string;
  amount: number;
  signature: string;
}): boolean {
  const secretKey = process.env.NICEPAY_SECRET_KEY ?? "";
  const hash = crypto
    .createHash("sha256")
    .update(`${params.authToken}${params.clientId}${params.amount}${secretKey}`)
    .digest("hex");
  return hash === params.signature;
}

type NicepayApproveResponse = {
  resultCode: string;
  resultMsg?: string;
  tid: string;
  status: string;
  amount: number;
  payMethod?: string;
  card?: unknown;
  bank?: unknown;
  vbank?: unknown;
};

export async function approveNicepayPayment(
  tid: string,
  amount: number
): Promise<NicepayApproveResponse> {
  const res = await fetch(`${API_BASE}/v1/payments/${tid}`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const data = (await res.json()) as NicepayApproveResponse;
  if (!res.ok || data.resultCode !== "0000") {
    throw new Error(`나이스페이 결제 승인에 실패했습니다: ${data.resultMsg ?? data.resultCode}`);
  }
  return data;
}

export function derivePayMethod(response: NicepayApproveResponse): string {
  if (response.payMethod) return response.payMethod;
  if (response.card) return "card";
  if (response.bank) return "bank";
  if (response.vbank) return "vbank";
  return "card";
}

type NicepayCancelResponse = {
  resultCode: string;
  resultMsg?: string;
  tid: string;
  cancelledTid?: string;
  status: string;
};

export async function cancelNicepayPayment(
  tid: string,
  orderId: string,
  reason: string,
  cancelAmt?: number
): Promise<NicepayCancelResponse> {
  const res = await fetch(`${API_BASE}/v1/payments/${tid}/cancel`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({
      reason,
      orderId,
      ...(cancelAmt !== undefined ? { cancelAmt } : {}),
    }),
  });
  const data = (await res.json()) as NicepayCancelResponse;
  if (!res.ok || data.resultCode !== "0000") {
    throw new Error(`나이스페이 결제 취소에 실패했습니다: ${data.resultMsg ?? data.resultCode}`);
  }
  return data;
}
