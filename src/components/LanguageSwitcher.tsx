"use client";

import { useEffect, useState } from "react";

type LangCode = "ko" | "en" | "ja";

const LANGS: { code: LangCode; flag: string; label: string }[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
];

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

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<LangCode>("ko");

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
    document.body.appendChild(script);
  }, []);

  function handleSelect(lang: LangCode) {
    if (lang === current) return;
    writeLangCookie(lang);
    window.location.reload();
  }

  return (
    <div className="notranslate flex items-center gap-1">
      <div id="google_translate_element" className="hidden" />
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => handleSelect(lang.code)}
          aria-label={lang.label}
          aria-pressed={current === lang.code}
          title={lang.label}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-base transition ${
            current === lang.code
              ? "bg-brand-100 ring-1 ring-brand-400 dark:bg-brand-900/40"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
