import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource/dm-mono/latin-400.css";
import "@fontsource/dm-mono/latin-500.css";
import "../globals.css";
import brand from "@brand";
import { palette } from "@/brand/palette";
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
  // A share picture has to be given as a full address, so it waits for the published address too.
  const images = brand.shareImage && brand.siteUrl ? [{ url: asset(brand.shareImage), width: 1200, height: 630 }] : undefined;
  return {
    // Without the published address, tags that need a full address are left out rather than pointed at a guess.
    metadataBase: brand.siteUrl ? new URL(brand.siteUrl) : undefined,
    title,
    description: dict.meta.description,
    icons: brand.logo ? { icon: asset(brand.logo) } : undefined,
    alternates: brand.siteUrl
      ? { canonical: "/" + locale + "/", languages: Object.fromEntries(locales.map((l) => [htmlLang[l], "/" + l + "/"])) }
      : undefined,
    openGraph: { title, description: dict.meta.description, locale: htmlLang[locale], type: "website", siteName: brand.name[locale], images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description: dict.meta.description, images },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} style={palette}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only z-50 rounded-full bg-ink px-5 py-3 font-medium text-stage focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          {dict.skip}
        </a>
        <SiteHeader locale={locale} dict={dict} />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}
