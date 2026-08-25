import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export default async function MyChatsPage() {
  const session = await auth();
  if (session?.user?.type !== "user") {
    redirect("/login?callbackUrl=/my/chats");
  }

  const threads = await prisma.chatThread.findMany({
    where: { OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }] },
    orderBy: { updatedAt: "desc" },
    include: {
      post: true,
      buyer: true,
      seller: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="text-xl font-bold">채팅</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        내가 문의했거나, 내 글에 문의가 온 채팅을 모두 볼 수 있어요.
      </p>

      {threads.length === 0 ? (
        <p className="mt-8 text-center text-sm text-black/40 dark:text-white/40">
          아직 채팅이 없습니다.
        </p>
      ) : (
        <ul className="mt-5 space-y-2">
          {threads.map((t) => {
            const isBuyer = t.buyerId === session.user.id;
            const otherParty = isBuyer ? t.seller : t.buyer;
            const lastMessage = t.messages[0];
            return (
              <li key={t.id}>
                <Link
                  href={`/chat/${t.id}`}
                  className="block rounded-xl border border-black/10 bg-white p-4 transition hover:bg-black/[0.02] dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{t.post.title}</p>
                    {lastMessage && (
                      <span className="shrink-0 text-[11px] text-black/40 dark:text-white/40">
                        {formatDate(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                    {otherParty.name}
                    {isBuyer ? " (판매자)" : " (문의자)"}
                  </p>
                  <p className="mt-1 truncate text-sm text-black/60 dark:text-white/60">
                    {lastMessage ? lastMessage.content : "대화를 시작해보세요."}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
