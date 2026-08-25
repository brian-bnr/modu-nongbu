// 서버(pusher.ts)와 클라이언트(ChatRoom.tsx)가 함께 참조하는 상수.
// 서버 전용 "pusher" 패키지를 import하지 않도록 별도 파일로 분리한다.
export function chatChannelName(threadId: string) {
  return `chat-thread-${threadId}`;
}

export const CHAT_MESSAGE_EVENT = "new-message";
