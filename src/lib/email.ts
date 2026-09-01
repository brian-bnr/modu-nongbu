// Resend(https://resend.com) 이메일 발송 연동.
// API 키를 아직 등록하지 않았다면 조용히 건너뛴다 — src/lib/sms.ts와 동일한 패턴으로,
// 이메일 발송 실패가 비밀번호 재설정 요청 자체를 막아서는 안 된다.
import { Resend } from "resend";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[sendPasswordResetEmail] RESEND_API_KEY가 설정되지 않아 이메일을 보내지 않았습니다.");
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `모두의농부 <${fromEmail}>`,
      to,
      subject: "[모두의농부] 비밀번호 재설정 안내",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; line-height: 1.6; background: #EFF1ED; color: #2B2620; padding: 32px;">
          <h2>비밀번호 재설정</h2>
          <p>모두의농부 계정의 비밀번호 재설정을 요청하셨습니다. 아래 버튼을 눌러 새 비밀번호를 설정해주세요.</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background: #5A3E27; color: #EFF1ED; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
              비밀번호 재설정하기
            </a>
          </p>
          <p style="color: #2B2620; opacity: 0.6; font-size: 13px;">
            이 링크는 1시간 동안만 유효합니다. 본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.
          </p>
        </div>
      `,
    });
    if (error) {
      console.error("[sendPasswordResetEmail] 이메일 발송 실패", error);
    }
  } catch (err) {
    console.error("[sendPasswordResetEmail] 이메일 발송 중 오류", err);
  }
}
