// 서버(pusher.ts)와 클라이언트(ChatRoom.tsx)가 함께 참조하는 상수.
// 서버 전용 "pusher" 패키지를 import하지 않도록 별도 파일로 분리한다.
export function chatChannelName(threadId: string) {
  return `chat-thread-${threadId}`;
}

export const CHAT_MESSAGE_EVENT = "new-message";

// 채팅방을 열어두지 않았을 때(홈, 상품목록 등)도 안읽음 배지를 즉시 갱신하기 위한
// 사용자 개인 알림 채널. private- 접두사라 /api/pusher/auth를 통한 인증이 필요하다.
export function userChannelName(userId: string) {
  return `private-user-${userId}`;
}

export const NEW_CHAT_NOTIFICATION_EVENT = "new-chat-notification";
