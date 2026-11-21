import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { LocaleSwitch } from "./locale-switch";
import { MobileMenu } from "./mobile-menu";

/** The sections a visitor can jump to, in page order. Sections the brand leaves out are not listed. */
export function sectionLinks(dict: Dictionary) {
  return [
    ...(brand.turntable ? [{ href: "#turntable", label: dict.nav.turntable }] : []),
    ...(brand.products.some((product) => product.sketch) ? [{ href: "#design", label: dict.nav.design }] : []),
    { href: "#products", label: dict.nav.products },
    { href: "#process", label: dict.nav.process },
    { href: "#contact", label: dict.nav.contact },
  ];
}

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links = sectionLinks(dict);

  return (
    <header className="sticky top-2 z-30 px-2 pt-2 md:top-3 md:px-3 md:pt-3">
      <div className="relative mx-auto flex h-16 max-w-[85rem] items-center justify-between gap-3 rounded-full bg-stage/85 pr-2.5 pl-4 shadow-[0_14px_34px_-18px_rgb(0_0_0/0.8)] ring-1 ring-ink/10 backdrop-blur-xl md:gap-6 md:pl-6">
        {/* The link is named by the brand it shows; it leads to the top of the page. */}
        <a href="#top" className="rounded-full">
          <Logo locale={locale} />
        </a>

        <nav className="hidden items-center gap-1 text-[0.9375rem] font-medium lg:flex">
          {links.slice(0, -1).map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2.5 transition-colors duration-300 hover:bg-ink hover:text-stage">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <LocaleSwitch locale={locale} label={dict.cta.language} className="max-sm:hidden" />
          <ButtonLink href="#inquiry" variant="primary" arrow={false} className="px-4 sm:hidden">
            {dict.cta.short}
          </ButtonLink>
          <ButtonLink href="#inquiry" variant="primary" className="max-sm:hidden">
            {dict.cta.brief}
          </ButtonLink>
          <MobileMenu links={links} labels={{ menu: dict.cta.menu, close: dict.cta.close }}>
            <LocaleSwitch locale={locale} label={dict.cta.language} />
            <ButtonLink href="#inquiry" variant="primary">
              {dict.cta.brief}
            </ButtonLink>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
