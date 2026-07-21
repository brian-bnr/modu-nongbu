import Image from "next/image";
import type { Role } from "@prisma/client";
import { switchRoleAction } from "@/lib/actions/role";

const ROLE_OPTIONS: { role: Role; label: string; icon: string }[] = [
  { role: "FARMER", label: "농민 모드", icon: "/icons/category/farmer.png" },
  { role: "OPERATOR", label: "방제사 모드", icon: "/icons/category/drone.png" },
  { role: "EXPERT", label: "전문가 모드", icon: "/icons/category/sprout.png" },
  { role: "COMPANY", label: "업체 모드", icon: "/icons/category/bank.png" },
];

export function RoleSwitcher({ currentRole }: { currentRole: Role }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs text-black/40 dark:text-white/40">역할 전환</p>
      <div className="flex items-center gap-2">
        {ROLE_OPTIONS.map((opt) => (
          <form key={opt.role} action={switchRoleAction.bind(null, opt.role)}>
            <button
              type="submit"
              title={opt.label}
              aria-label={opt.label}
              aria-current={currentRole === opt.role}
              disabled={currentRole === opt.role}
              className={`relative block h-9 w-9 overflow-hidden rounded-full ring-2 transition ${
                currentRole === opt.role
                  ? "ring-brand-600"
                  : "opacity-40 ring-transparent hover:opacity-100"
              }`}
            >
              <Image src={opt.icon} alt="" fill sizes="36px" className="object-cover" />
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
