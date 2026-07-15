"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type Slide = {
  image: string;
  tag: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  href: string;
  gradient: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function updateProgress() {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }

  function scrollByCard(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? el.clientWidth;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
      <div
        ref={trackRef}
        onScroll={updateProgress}
        className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth"
      >
        {slides.map((slide, i) => (
          <Link
            key={slide.href}
            href={slide.href}
            className={`group relative h-72 w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl bg-gradient-to-br sm:h-80 sm:w-[calc(50%-8px)] ${slide.gradient}`}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 85vw"
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              className="object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 top-4 px-5">
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black/80">
                {slide.tag}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                {slide.title}
              </h1>
              <p className="mt-2 text-sm text-white/85">{slide.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-brand-700 transition-[width]"
            style={{ width: `${Math.max(15, progress * 100)}%` }}
          />
        </div>
        <button
          type="button"
          aria-label="이전"
          onClick={() => scrollByCard(-1)}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/60 hover:bg-black/5 sm:flex"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="다음"
          onClick={() => scrollByCard(1)}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-black/60 hover:bg-black/5 sm:flex"
        >
          →
        </button>
      </div>
    </div>
  );
}
