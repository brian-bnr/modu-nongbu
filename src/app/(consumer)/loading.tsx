export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
        <div className="flex gap-4">
          <div className="h-72 w-[85%] shrink-0 rounded-3xl bg-black/[0.06] sm:h-80 sm:w-[calc(50%-8px)]" />
          <div className="hidden h-80 w-[calc(50%-8px)] shrink-0 rounded-3xl bg-black/[0.06] sm:block" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="grid grid-cols-5 gap-x-2 gap-y-6 lg:grid-cols-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="h-14 w-14 rounded-2xl bg-black/[0.06] sm:h-16 sm:w-16" />
              <div className="h-3 w-10 rounded bg-black/[0.06]" />
            </div>
          ))}
        </div>

        <div className="mt-12 h-6 w-28 rounded bg-black/[0.06]" />
        <div className="mt-4 flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-32 shrink-0 rounded-xl bg-black/[0.06] sm:h-24 sm:w-40" />
          ))}
        </div>
      </div>
    </div>
  );
}
