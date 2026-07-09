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
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">{description}</p>

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

      <p className="mt-6 inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/50 dark:bg-white/10 dark:text-white/50">
        준비중입니다. 곧 만나요!
      </p>
    </div>
  );
}
