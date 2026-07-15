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

const LANGS: { code: LangCode; short: string; label: string }[] = [
  { code: "ko", short: "KOR", label: "한국어" },
  { code: "en", short: "EN", label: "English" },
  { code: "ja", short: "JP", label: "日本語" },
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
    <div className="notranslate flex items-center gap-1">
      <div id="google_translate_element" className="hidden" />
      {LANGS.map(({ code, short, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSelect(code)}
          disabled={unavailable || pending !== null}
          aria-label={label}
          aria-pressed={current === code}
          title={unavailable ? "번역 서비스를 불러올 수 없어요" : label}
          className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold tracking-wide shadow-sm ring-1 transition disabled:opacity-40 sm:px-2 sm:py-1 sm:text-xs ${
            current === code
              ? "bg-brand-500 text-white ring-brand-500"
              : "text-neutral-700 ring-black/10 opacity-70 hover:opacity-100 dark:text-neutral-200 dark:ring-white/20"
          } ${pending === code ? "animate-pulse" : ""}`}
        >
          {short}
        </button>
      ))}
    </div>
  );
}
