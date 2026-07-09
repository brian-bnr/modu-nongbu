import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { formatDate } from "@/lib/format";

const NEW_USER_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true, inquiries: true } } },
  });

  const now = Date.now();

  return (
    <div>
      <h1 className="text-2xl font-bold">회원 관리</h1>
      {users.length === 0 ? (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">가입한 회원이 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {users.map((user) => {
            const isNew = now - user.createdAt.getTime() < NEW_USER_WINDOW_MS;
            return (
              <li key={user.id}>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="block rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {user.name} · {user.email}
                    </p>
                    {isNew && <Badge variant="amber">신규</Badge>}
                  </div>
                  <p className="mt-1 text-black/50 dark:text-white/50">
                    {user.phone} {user.region ? `· ${user.region}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                    글 {user._count.posts}개 · 문의 {user._count.inquiries}건 · 가입일{" "}
                    {formatDate(user.createdAt)}
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
