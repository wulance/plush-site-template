import type { Locale } from "@/i18n/config";
import { localeLabels, locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = [
    { href: "#turntable", label: dict.nav.turntable },
    { href: "#design", label: dict.nav.design },
    { href: "#products", label: dict.nav.products },
    { href: "#process", label: dict.nav.process },
  ];

  return (
    <header className="sticky top-2 z-30 px-2 pt-2 md:top-3 md:px-3 md:pt-3">
      <div className="mx-auto flex h-16 max-w-[85rem] items-center justify-between gap-4 rounded-full bg-stage/85 pr-2.5 pl-4 shadow-[0_14px_34px_-18px_rgb(0_0_0/0.8)] ring-1 ring-ink/10 backdrop-blur-xl md:gap-6 md:pl-6">
        <a href="#top" aria-label={dict.footer.top}>
          <Logo locale={locale} />
        </a>

        <nav className="hidden items-center gap-1 text-[0.9375rem] font-medium lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 transition-colors duration-300 hover:bg-ink hover:text-stage">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1 text-sm">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="opacity-30">/</span>}
                <a
                  href={asset("/" + l + "/")}
                  hrefLang={l}
                  aria-current={l === locale ? "true" : undefined}
                  className={cn("rounded-full px-1.5 py-1 transition-opacity", l === locale ? "font-semibold" : "opacity-50 hover:opacity-100")}
                >
                  {localeLabels[l]}
                </a>
              </span>
            ))}
          </div>
          <ButtonLink href="#contact" variant="primary" className="max-sm:hidden">
            {dict.cta.brief}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
