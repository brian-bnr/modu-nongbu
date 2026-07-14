import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { PageIntro, StatTile, SectionCard, GridCard } from "@/components/admin/AdminUI";
import { formatDate } from "@/lib/format";

const NEW_USER_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true, inquiries: true } } },
  });

  const now = Date.now();
  const newUserCount = users.filter((u) => now - u.createdAt.getTime() < NEW_USER_WINDOW_MS).length;

  return (
    <div>
      <PageIntro title="회원 관리" subtitle={`전체 ${users.length.toLocaleString("ko-KR")}명`} />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
        <StatTile label="전체 회원" value={users.length} color="blue" delay={0} />
        <StatTile label="최근 5일 신규가입" value={newUserCount} color="amber" delay={40} />
      </div>

      <div className="mt-6">
        <SectionCard title="회원 목록" tone="blue" delay={80}>
          {users.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">가입한 회원이 없습니다.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {users.map((user, i) => {
                const isNew = now - user.createdAt.getTime() < NEW_USER_WINDOW_MS;
                return (
                  <GridCard key={user.id} href={`/admin/users/${user.id}`} delay={i * 30}>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      {isNew && <Badge variant="amber">신규</Badge>}
                    </div>
                    <div>
                      <p className="text-black/50 dark:text-white/50">{user.email}</p>
                      <p className="mt-1 text-black/50 dark:text-white/50">
                        {[user.phone, user.region].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                        글 {user._count.posts}개 · 문의 {user._count.inquiries}건 · 가입일{" "}
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </GridCard>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
