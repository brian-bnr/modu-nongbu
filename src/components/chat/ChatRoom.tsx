"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sendChatMessage, type SendMessageState } from "@/lib/actions/chat";
import { getPusherClient } from "@/lib/pusherClient";
import { chatChannelName, CHAT_MESSAGE_EVENT } from "@/lib/chatShared";

type ChatMessageItem = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
};

const initialState: SendMessageState = { status: "idle" };

export function ChatRoom({
  threadId,
  currentUserId,
  initialMessages,
  otherPartyName,
}: {
  threadId: string;
  currentUserId: string;
  initialMessages: ChatMessageItem[];
  otherPartyName: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendAction = sendChatMessage.bind(null, threadId);
  const [state, formAction, isPending] = useActionState(sendAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) {
      // Pusher 미설정 시: 10초마다 서버 데이터를 다시 불러와 새 메시지를 반영한다.
      const interval = setInterval(() => router.refresh(), 10000);
      return () => clearInterval(interval);
    }

    const channel = pusher.subscribe(chatChannelName(threadId));
    channel.bind(CHAT_MESSAGE_EVENT, (data: ChatMessageItem) => {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
    });

    return () => {
      channel.unbind(CHAT_MESSAGE_EVENT);
      pusher.unsubscribe(chatChannelName(threadId));
    };
  }, [threadId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => {
    if (state.status === "idle") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
        <p className="font-semibold">{otherPartyName}님과의 채팅</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <p className="mt-4 text-center text-sm text-black/40 dark:text-white/40">
            첫 메시지를 보내보세요.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUserId;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] whitespace-pre-line break-words rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-brand-700 text-white"
                      : "bg-black/5 text-foreground dark:bg-white/10"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form ref={formRef} action={formAction} className="flex gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <input
          type="text"
          name="content"
          placeholder="메시지를 입력하세요"
          autoComplete="off"
          className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
        >
          전송
        </button>
      </form>
      {state.status === "error" && (
        <p className="px-3 pb-2 text-xs text-red-600">{state.error}</p>
      )}
    </div>
  );
}
