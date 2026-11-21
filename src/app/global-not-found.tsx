import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/instrument-sans";
import "./globals.css";
import brand from "@brand";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { palette } from "@/brand/palette";
import { defaultLocale, htmlLang, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";

export const viewport: Viewport = { themeColor: brand.colors.stage };

export const metadata: Metadata = {
  title: getDictionary(defaultLocale).notFound.title + " — " + brand.name[defaultLocale],
  icons: brand.logo ? { icon: asset(brand.logo) } : undefined,
};

/** Any address the site does not have. A static host serves this one page for all of them, so it speaks every language of the site. */
export default function NotFound() {
  return (
    <html lang={htmlLang[defaultLocale]} style={palette}>
      <body>
        <main className="shell flex min-h-dvh flex-col justify-between gap-16 py-8">
          <a href={asset("/" + defaultLocale + "/")} className="self-start">
            <Logo locale={defaultLocale} />
          </a>
          <div>
            <p aria-hidden className="display text-[clamp(6rem,26vw,18rem)] text-accent">
              404
            </p>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {locales.map((locale) => {
                const t = getDictionary(locale).notFound;
                return (
                  <div key={locale} lang={htmlLang[locale]}>
                    <h1 className="title text-3xl md:text-4xl">{t.title}</h1>
                    <p className="mt-3 max-w-sm text-lg leading-snug text-ink-soft">{t.body}</p>
                    <ButtonLink href={asset("/" + locale + "/")} variant={locale === defaultLocale ? "primary" : "ghost"} className="mt-6">
                      {t.home}
                    </ButtonLink>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="note text-ink-soft">{brand.legalName[defaultLocale]}</p>
        </main>
      </body>
    </html>
  );
}
