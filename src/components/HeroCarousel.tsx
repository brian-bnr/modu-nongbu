"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = {
  image: string;
  tag: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  href: string;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { root: containerRef.current, threshold: 0.6 }
    );
    for (const el of slideRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [slides.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {slides.map((slide, i) => (
          <Link
            key={slide.href}
            href={slide.href}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="group relative h-[480px] w-full shrink-0 snap-start sm:h-[560px] lg:h-[640px]"
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-8 sm:pb-16">
                <div className="max-w-xl">
                  <span className="inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                    {slide.tag}
                  </span>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="mt-3 text-base text-white/85 sm:text-lg">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
        {slides.map((slide, i) => (
          <span
            key={slide.href}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
