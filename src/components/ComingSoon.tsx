import Image from "next/image";

export function ComingSoon({
  icon,
  title,
  description,
  features,
}: {
  icon: string;
  title: string;
  description: string;
  features?: string[];
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl dark:bg-brand-900/30">
        {icon}
      </div>
      <h1 className="mt-4 text-xl font-bold">{title}</h1>
      <p className="mt-2 break-keep text-sm text-black/60 dark:text-white/60">{description}</p>

      {features && features.length > 0 && (
        <ul className="mt-6 space-y-2 text-left">
          {features.map((feature) => (
            <li
              key={feature}
              className="rounded-xl border border-black/5 bg-white px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 inline-flex flex-col items-center gap-1 rounded-2xl bg-black/5 px-4 py-3 dark:bg-white/10">
        <p className="text-sm font-semibold text-black/70 dark:text-white/70">
          죄송해요 😥 조만간 서비스 예정이에요
        </p>
        <p className="text-xs text-black/50 dark:text-white/50">
          귀엽고 멋진 기능으로 곧 찾아올게요 ✨
        </p>
      </div>

      <Image
        src="/coming-soon-mascot.png"
        alt=""
        width={941}
        height={1672}
        className="mx-auto mt-6 w-40 rounded-2xl shadow-sm sm:w-48"
      />
    </div>
  );
}
