"use client";

import { useEffect, useState } from "react";

type LangCode = "ko" | "en" | "ja";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => unknown;
      };
    };
  }
}

type TrigramLine = "yang" | "yin";

function Trigram({ x, y, lines }: { x: number; y: number; lines: [TrigramLine, TrigramLine, TrigramLine] }) {
  const w = 6;
  const barH = 1;
  const rowGap = 0.6;
  const gapW = 0.8;
  const segW = (w - gapW) / 2;
  return (
    <g fill="#000">
      {lines.map((type, i) => {
        const rowY = y + i * (barH + rowGap);
        return type === "yang" ? (
          <rect key={i} x={x} y={rowY} width={w} height={barH} />
        ) : (
          <g key={i}>
            <rect x={x} y={rowY} width={segW} height={barH} />
            <rect x={x + segW + gapW} y={rowY} width={segW} height={barH} />
          </g>
        );
      })}
    </g>
  );
}

function FlagKR() {
  const cx = 15;
  const cy = 10;
  const r = 5;
  const half = r / 2;
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full">
      <rect width="30" height="20" fill="#fff" />
      <circle cx={cx} cy={cy} r={r} fill="#003478" />
      <path
        d={`M${cx},${cy - r} A${r},${r} 0 0 1 ${cx},${cy + r} A${half},${half} 0 0 1 ${cx},${cy} A${half},${half} 0 0 0 ${cx},${cy - r} Z`}
        fill="#c60c30"
      />
      {/* 건(하늘, 좌상) 감(물, 우상) 리(불, 좌하) 곤(땅, 우하) */}
      <Trigram x={2} y={2} lines={["yang", "yang", "yang"]} />
      <Trigram x={22} y={2} lines={["yin", "yang", "yin"]} />
      <Trigram x={2} y={13.8} lines={["yang", "yin", "yang"]} />
      <Trigram x={22} y={13.8} lines={["yin", "yin", "yin"]} />
    </svg>
  );
}

function FlagUS() {
  const stripeH = 20 / 7;
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full">
      <rect width="30" height="20" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map(
        (i) =>
          i % 2 === 0 && (
            <rect key={i} y={i * stripeH} width="30" height={stripeH} fill="#b22234" />
          )
      )}
      <rect width="13" height={stripeH * 4} fill="#3c3b6e" />
    </svg>
  );
}

function FlagJP() {
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full">
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="5.5" fill="#bc002d" />
    </svg>
  );
}

const LANGS: { code: LangCode; Flag: () => React.JSX.Element; label: string }[] = [
  { code: "ko", Flag: FlagKR, label: "한국어" },
  { code: "en", Flag: FlagUS, label: "English" },
  { code: "ja", Flag: FlagJP, label: "日本語" },
];

function readLangFromCookie(): LangCode {
  const match = document.cookie.match(/googtrans=\/ko\/(en|ja)/);
  return (match?.[1] as LangCode) ?? "ko";
}

function writeLangCookie(lang: LangCode) {
  const host = window.location.hostname;
  const bareDomain = host.replace(/^www\./, "");
  const domainScopes = [``, `; domain=${host}`, `; domain=.${bareDomain}`];
  for (const scope of domainScopes) {
    if (lang === "ko") {
      document.cookie = `googtrans=; path=/${scope}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } else {
      document.cookie = `googtrans=/ko/${lang}; path=/${scope}`;
    }
  }
}

function findCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>(".goog-te-combo");
}

function waitForCombo(timeoutMs = 8000): Promise<HTMLSelectElement | null> {
  return new Promise((resolve) => {
    const existing = findCombo();
    if (existing) {
      resolve(existing);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      const combo = findCombo();
      if (combo || Date.now() - start > timeoutMs) {
        clearInterval(timer);
        resolve(combo);
      }
    }, 200);
  });
}

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<LangCode>("ko");
  const [pending, setPending] = useState<LangCode | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setCurrent(readLangFromCookie());

    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      const TranslateElement = window.google?.translate.TranslateElement;
      if (!TranslateElement) return;
      new TranslateElement(
        { pageLanguage: "ko", includedLanguages: "en,ja", autoDisplay: false },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => setUnavailable(true);
    document.body.appendChild(script);
  }, []);

  async function handleSelect(lang: LangCode) {
    if (lang === current || pending) return;

    if (lang === "ko") {
      writeLangCookie("ko");
      window.location.reload();
      return;
    }

    setPending(lang);
    const combo = await waitForCombo();
    if (!combo) {
      writeLangCookie(lang);
      window.location.reload();
      return;
    }
    combo.value = lang;
    combo.dispatchEvent(new Event("change"));
    writeLangCookie(lang);

    // 구글 번역 위젯이 드롭다운 변경에 응답하지 않는 경우가 간헐적으로 있어,
    // 실제로 번역이 적용됐는지 확인하고 안 됐으면 쿠키+새로고침으로 재시도한다.
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const applied = document.documentElement.classList.contains("translated-ltr");
    if (!applied) {
      window.location.reload();
      return;
    }
    setCurrent(lang);
    setPending(null);
  }

  return (
    <div className="notranslate flex items-center gap-1.5">
      <div id="google_translate_element" className="hidden" />
      {LANGS.map(({ code, Flag, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSelect(code)}
          disabled={unavailable || pending !== null}
          aria-label={label}
          aria-pressed={current === code}
          title={unavailable ? "번역 서비스를 불러올 수 없어요" : label}
          className={`h-5 w-[26px] overflow-hidden rounded-[3px] shadow-sm ring-1 transition disabled:opacity-40 ${
            current === code
              ? "ring-2 ring-brand-500"
              : "ring-black/10 opacity-70 hover:opacity-100 dark:ring-white/20"
          } ${pending === code ? "animate-pulse" : ""}`}
        >
          <Flag />
        </button>
      ))}
    </div>
  );
}
