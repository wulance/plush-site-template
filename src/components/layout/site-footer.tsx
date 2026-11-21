import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Logo } from "@/components/ui/logo";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="shell pt-10 pb-10">
      <div className="stitch text-ink/25" />
      <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
        <Logo locale={locale} />
        <p className="note text-ink-soft">
          © {new Date().getFullYear()} {brand.legalName[locale]} {dict.footer.rights}
        </p>
        <a href="#top" className="note underline-offset-4 hover:underline">
          {dict.footer.top} ↑
        </a>
      </div>
    </footer>
  );
}
