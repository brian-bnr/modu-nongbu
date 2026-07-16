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
    <div className="mx-auto max-w-lg px-4 py-8 text-center">
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

      <Image
        src="/coming-soon-mascot.png"
        alt="죄송해요, 조만간 서비스로 찾아올게요"
        width={941}
        height={1672}
        priority
        className="mx-auto mt-6 w-full max-w-xs rounded-3xl shadow-sm sm:max-w-sm"
      />
    </div>
  );
}
