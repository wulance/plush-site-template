import type { Metadata } from "next";
import brand from "@brand";
import { defaultLocale, htmlLang } from "@/i18n/config";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: brand.name[defaultLocale],
  icons: brand.logo ? { icon: asset(brand.logo) } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={htmlLang[defaultLocale]}>
      <body>{children}</body>
    </html>
  );
}
