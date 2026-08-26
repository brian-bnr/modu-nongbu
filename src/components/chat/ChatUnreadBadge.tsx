"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusherClient";
import { getUnreadChatCount } from "@/lib/actions/chat";
import { userChannelName, NEW_CHAT_NOTIFICATION_EVENT } from "@/lib/chatShared";

export function ChatUnreadBadge({ userId }: { userId: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      getUnreadChatCount().then((c) => {
        if (!cancelled) setCount(c);
      });
    };
    refresh();

    const pusher = getPusherClient();
    if (!pusher) {
      // Pusher 미설정 시: 15초마다 안읽음 개수를 다시 조회한다.
      const interval = setInterval(refresh, 15000);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    const channelName = userChannelName(userId);
    const channel = pusher.subscribe(channelName);
    channel.bind(NEW_CHAT_NOTIFICATION_EVENT, refresh);

    return () => {
      cancelled = true;
      channel.unbind(NEW_CHAT_NOTIFICATION_EVENT, refresh);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
