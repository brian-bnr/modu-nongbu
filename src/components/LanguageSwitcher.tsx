"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LangCode = "ko" | "en" | "ja";

const LANGS: { code: LangCode; flag: string; label: string }[] = [
  { code: "ko", flag: "/flags/kr.svg", label: "한국어" },
  { code: "en", flag: "/flags/us.svg", label: "English" },
  { code: "ja", flag: "/flags/jp.svg", label: "日本語" },
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
      const TranslateElement = window.google?.translate?.TranslateElement;
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
    <div className="notranslate flex shrink-0 items-center gap-1 sm:gap-1.5">
      <div id="google_translate_element" className="hidden" />
      {LANGS.map(({ code, flag, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSelect(code)}
          disabled={unavailable || pending !== null}
          aria-label={label}
          aria-pressed={current === code}
          title={unavailable ? "번역 서비스를 불러올 수 없어요" : label}
          className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 transition disabled:opacity-40 sm:h-7 sm:w-7 ${
            current === code
              ? "scale-110 ring-white"
              : "opacity-60 ring-white/30 hover:opacity-100"
          } ${pending === code ? "animate-pulse" : ""}`}
        >
          <Image src={flag} alt="" width={28} height={28} className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
