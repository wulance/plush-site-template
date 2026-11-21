import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import "@fontsource-variable/instrument-sans";
import "@fontsource/dm-mono/latin-400.css";
import "@fontsource/dm-mono/latin-500.css";
import "../globals.css";
import brand from "@brand";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: brand.colors.stage };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const title = brand.name[locale] + " — " + dict.meta.title;
  return {
    metadataBase: new URL(brand.siteUrl),
    title,
    description: dict.meta.description,
    icons: brand.logo ? { icon: asset(brand.logo) } : undefined,
    alternates: { languages: Object.fromEntries(locales.map((l) => [htmlLang[l], "/" + l + "/"])) },
    openGraph: { title, description: dict.meta.description, locale: htmlLang[locale], type: "website" },
  };
}

/** The brand's colours, set over the defaults in globals.css. */
const palette = {
  "--color-stage": brand.colors.stage,
  "--color-stage-deep": brand.colors.stageDeep,
  "--color-ink": brand.colors.ink,
  "--color-ink-soft": brand.colors.inkSoft,
  "--color-accent": brand.colors.accent,
  "--color-accent-deep": brand.colors.accentDeep,
  "--color-warm": brand.colors.warm,
  "--color-cool": brand.colors.cool,
} as CSSProperties;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} style={palette}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}
