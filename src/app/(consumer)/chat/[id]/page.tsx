import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default async function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.type !== "user") {
    notFound();
  }

  const thread = await prisma.chatThread.findUnique({
    where: { id },
    include: {
      post: true,
      buyer: true,
      seller: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread || (thread.buyerId !== session.user.id && thread.sellerId !== session.user.id)) {
    notFound();
  }

  const otherParty = thread.buyerId === session.user.id ? thread.seller : thread.buyer;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <Link href="/my/chats" className="text-sm text-brand-700 hover:underline dark:text-brand-400">
        ← 채팅 목록
      </Link>
      <p className="mt-2 text-sm text-black/50 dark:text-white/50">{thread.post.title}</p>

      <div className="mt-3">
        <ChatRoom
          threadId={thread.id}
          currentUserId={session.user.id}
          otherPartyName={otherParty.name}
          initialMessages={thread.messages.map((m) => ({
            id: m.id,
            senderId: m.senderId,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
