"use client";

import type { Locale } from "@/i18n/config";
import { htmlLang, localeLabels, locales } from "@/i18n/config";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

/** The languages of the site. Switching keeps the section being read: the address keeps its #part. */
export function LocaleSwitch({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn("flex items-center text-[0.9375rem]", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className="opacity-30">/</span>}
          <a
            href={asset("/" + l + "/")}
            lang={htmlLang[l]}
            hrefLang={htmlLang[l]}
            aria-current={l === locale ? "true" : undefined}
            onClick={(event) => {
              event.currentTarget.hash = window.location.hash;
            }}
            className={cn("grid h-11 min-w-11 place-items-center rounded-full px-2 transition-colors", l === locale ? "font-semibold" : "text-ink-soft hover:text-ink")}
          >
            {localeLabels[l]}
          </a>
        </span>
      ))}
    </div>
  );
}
