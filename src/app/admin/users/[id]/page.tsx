import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/Badge";
import { requireAdmin } from "@/lib/auth";
import {
  formatDate,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_VARIANT,
  POST_STATUS_LABEL,
  POST_STATUS_VARIANT,
  POST_TYPE_LABEL,
  ROLE_LABEL,
  ROLE_VARIANT,
  DRONE_OPERATOR_STATUS_LABEL,
  DRONE_OPERATOR_STATUS_VARIANT,
  EXPERT_SPECIALTY_LABEL,
} from "@/lib/format";

const JOB_TYPES = new Set(["FIND_WORKER", "LOOKING_FOR_WORK"]);
const NEW_USER_WINDOW_MS = 5 * 24 * 60 * 60 * 1000;

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      inquiries: { orderBy: { createdAt: "desc" }, include: { post: true } },
      droneOperator: true,
      expertProfile: true,
      companyProfile: true,
    },
  });

  if (!user) {
    notFound();
  }

  const isNew = Date.now() - user.createdAt.getTime() < NEW_USER_WINDOW_MS;

  return (
    <div>
      <Link
        href="/admin/users"
        className="text-sm text-brand-700 hover:underline dark:text-brand-400"
      >
        ← 회원 목록으로
      </Link>

      <div className="mt-2 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{user.name}</p>
          <Badge variant={ROLE_VARIANT[user.role]}>{ROLE_LABEL[user.role]} 모드</Badge>
          {isNew && <Badge variant="amber">신규</Badge>}
        </div>
        <p className="mt-1 text-black/60 dark:text-white/60">
          {user.email}
          {user.phone ? ` · ${user.phone}` : ""}
        </p>
        {user.region && <p className="mt-1 text-black/60 dark:text-white/60">{user.region}</p>}
        <p className="mt-2 text-xs text-black/40 dark:text-white/40">
          가입일 {formatDate(user.createdAt)}
        </p>
      </div>

      {user.role === "FARMER" && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge variant="neutral">
            논 {user.hasPaddyField === null ? "미입력" : user.hasPaddyField ? "있음" : "없음"}
          </Badge>
          <Badge variant="neutral">
            밭 {user.hasUplandField === null ? "미입력" : user.hasUplandField ? "있음" : "없음"}
          </Badge>
        </div>
      )}

      {user.role === "OPERATOR" && (
        <div className="mt-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
          <div className="flex items-center justify-between">
            <p className="font-semibold">방제사 정보</p>
            {user.droneOperator && (
              <Badge variant={DRONE_OPERATOR_STATUS_VARIANT[user.droneOperator.status]}>
                {DRONE_OPERATOR_STATUS_LABEL[user.droneOperator.status]}
              </Badge>
            )}
          </div>
          {user.droneOperator ? (
            <div className="mt-2 space-y-1 text-black/60 dark:text-white/60">
              {user.droneOperator.droneModel && <p>드론 기종: {user.droneOperator.droneModel}</p>}
              {user.droneOperator.experienceYears != null && (
                <p>경력: {user.droneOperator.experienceYears}년</p>
              )}
              {user.droneOperator.activityRegion && (
                <p>활동 지역: {user.droneOperator.activityRegion}</p>
              )}
              {user.droneOperator.equipmentInfo && <p>비고: {user.droneOperator.equipmentInfo}</p>}
            </div>
          ) : (
            <p className="mt-2 text-black/50 dark:text-white/50">방제사 신청 내역이 없습니다.</p>
          )}
          <Link
            href="/admin/drones"
            className="mt-3 inline-block text-brand-700 hover:underline dark:text-brand-400"
          >
            드론 예약 관리로 이동 →
          </Link>
        </div>
      )}

      {user.role === "EXPERT" && (
        <div className="mt-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
          <p className="font-semibold">전문가 정보</p>
          {user.expertProfile ? (
            <div className="mt-2 space-y-1 text-black/60 dark:text-white/60">
              <p>분야: {EXPERT_SPECIALTY_LABEL[user.expertProfile.specialty]}</p>
              {user.expertProfile.activityRegion && (
                <p>활동 지역: {user.expertProfile.activityRegion}</p>
              )}
              {user.expertProfile.bio && <p>소개: {user.expertProfile.bio}</p>}
            </div>
          ) : (
            <p className="mt-2 text-black/50 dark:text-white/50">등록된 전문가 정보가 없습니다.</p>
          )}
        </div>
      )}

      {user.role === "COMPANY" && (
        <div className="mt-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
          <p className="font-semibold">업체 정보</p>
          {user.companyProfile ? (
            <div className="mt-2 space-y-1 text-black/60 dark:text-white/60">
              <p>업체 유형: {user.companyProfile.companyType}</p>
              {user.companyProfile.mainItem && <p>취급 품목: {user.companyProfile.mainItem}</p>}
              {user.companyProfile.activityRegion && (
                <p>활동 지역: {user.companyProfile.activityRegion}</p>
              )}
              {user.companyProfile.businessInfo && (
                <p>사업자 정보: {user.companyProfile.businessInfo}</p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-black/50 dark:text-white/50">등록된 업체 정보가 없습니다.</p>
          )}
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold">이 회원이 올린 글 {user.posts.length}건</h2>
      {user.posts.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">올린 글이 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {user.posts.map((post) => {
            const base = JOB_TYPES.has(post.postType) ? "/jobs" : "/products";
            return (
              <li key={post.id}>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
                >
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-black/40 dark:text-white/40">
                      {POST_TYPE_LABEL[post.postType]} · {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <Badge variant={POST_STATUS_VARIANT[post.status]}>
                    {POST_STATUS_LABEL[post.status]}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold">이 회원이 보낸 문의 {user.inquiries.length}건</h2>
      {user.inquiries.length === 0 ? (
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">보낸 문의가 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {user.inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/admin/inquiries/${inquiry.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-600 dark:border-white/10"
              >
                <div>
                  <p className="font-medium">{inquiry.post.title}</p>
                  <p className="text-xs text-black/40 dark:text-white/40">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <Badge variant={INQUIRY_STATUS_VARIANT[inquiry.status]}>
                  {INQUIRY_STATUS_LABEL[inquiry.status]}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
