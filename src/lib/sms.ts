// 알리고(Aligo, https://smartsms.aligo.in) 문자 발송 연동.
// API 키를 아직 등록하지 않았다면 조용히 건너뛴다 — 문자 발송 실패가
// 방제사 배정 같은 핵심 처리 흐름을 막아서는 안 된다.
function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export async function sendSms(to: string, message: string) {
  const apiKey = process.env.ALIGO_API_KEY;
  const userId = process.env.ALIGO_USER_ID;
  const sender = process.env.ALIGO_SENDER;

  if (!apiKey || !userId || !sender) {
    console.warn("[sendSms] ALIGO_API_KEY/ALIGO_USER_ID/ALIGO_SENDER가 설정되지 않아 문자를 보내지 않았습니다.");
    return;
  }

  const receiver = digitsOnly(to);
  if (!receiver) {
    console.warn("[sendSms] 수신번호가 없어 문자를 보내지 않았습니다.");
    return;
  }

  try {
    const res = await fetch("https://apis.aligo.in/send/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: apiKey,
        user_id: userId,
        sender: digitsOnly(sender),
        receiver,
        msg: message,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || data?.result_code !== "1") {
      console.error("[sendSms] 문자 발송 실패", data);
    }
  } catch (err) {
    console.error("[sendSms] 문자 발송 중 오류", err);
  }
}
