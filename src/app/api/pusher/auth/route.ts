import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { userChannelName } from "@/lib/chatShared";

// pusher-js가 private-* 채널을 구독하기 전에 호출하는 인증 엔드포인트.
// 본인 명의의 알림 채널(private-user-{내 id})만 구독을 허용해서 다른 사람의
// 새 채팅 알림을 엿볼 수 없게 한다.
export async function POST(req: NextRequest) {
  if (!pusherServer) {
    return NextResponse.json({ error: "pusher not configured" }, { status: 503 });
  }

  const session = await auth();
  if (session?.user?.type !== "user") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  const socketId = body.get("socket_id");
  const channelName = body.get("channel_name");

  if (typeof socketId !== "string" || typeof channelName !== "string") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (channelName !== userChannelName(session.user.id)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);
  return NextResponse.json(authResponse);
}
