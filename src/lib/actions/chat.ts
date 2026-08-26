"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { filterProfanity } from "@/lib/profanity";
import { pusherServer } from "@/lib/pusher";
import {
  chatChannelName,
  CHAT_MESSAGE_EVENT,
  userChannelName,
  NEW_CHAT_NOTIFICATION_EVENT,
} from "@/lib/chatShared";

export async function startChatAction(postId: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect(`/login?callbackUrl=/products/${postId}`);
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    redirect("/");
  }
  if (post.authorId === session.user.id) {
    redirect(`/products/${postId}`);
  }

  const thread = await prisma.chatThread.upsert({
    where: { postId_buyerId: { postId: post.id, buyerId: session.user.id } },
    update: {},
    create: { postId: post.id, buyerId: session.user.id, sellerId: post.authorId },
  });

  redirect(`/chat/${thread.id}`);
}

export type SendMessageState = { status: "idle" | "error"; error?: string };

export async function sendChatMessage(
  threadId: string,
  _prevState: SendMessageState,
  formData: FormData
): Promise<SendMessageState> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return { status: "error", error: "로그인이 필요합니다." };
  }

  const content = formData.get("content");
  if (typeof content !== "string" || content.trim().length === 0) {
    return { status: "error", error: "메시지를 입력해주세요." };
  }

  const thread = await prisma.chatThread.findUnique({ where: { id: threadId } });
  if (!thread || (thread.buyerId !== session.user.id && thread.sellerId !== session.user.id)) {
    return { status: "error", error: "채팅방을 찾을 수 없습니다." };
  }

  const message = await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      senderId: session.user.id,
      content: filterProfanity(content.trim()),
    },
  });

  await prisma.chatThread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });

  if (pusherServer) {
    await pusherServer.trigger(chatChannelName(thread.id), CHAT_MESSAGE_EVENT, {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    });

    // 상대방이 이 채팅방을 열어두고 있지 않아도(홈, 상품목록 등 다른 화면에 있어도)
    // 안읽음 배지가 즉시 갱신되도록 개인 알림 채널에도 별도로 알린다.
    const recipientId = thread.buyerId === session.user.id ? thread.sellerId : thread.buyerId;
    await pusherServer.trigger(userChannelName(recipientId), NEW_CHAT_NOTIFICATION_EVENT, {
      threadId: thread.id,
    });
  }

  revalidatePath(`/chat/${thread.id}`);
  revalidatePath("/my/chats");

  return { status: "idle" };
}

export async function getUnreadChatCount(): Promise<number> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return 0;
  }

  return prisma.chatMessage.count({
    where: {
      readAt: null,
      senderId: { not: session.user.id },
      thread: { OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] },
    },
  });
}

export async function markThreadReadAction(threadId: string) {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return;
  }

  await prisma.chatMessage.updateMany({
    where: {
      threadId,
      readAt: null,
      senderId: { not: session.user.id },
      thread: { OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] },
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/my/chats");
}
