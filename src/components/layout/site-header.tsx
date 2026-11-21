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
    <header className="sticky top-0 z-30 border-b border-line bg-stage/95 backdrop-blur-xl">
      <div className="shell relative flex h-18 items-center justify-between gap-3 md:h-24 md:gap-6">
        {/* The link is named by the brand it shows; it leads to the top of the page. */}
        <a href="#top" className="inline-flex min-h-11 items-center">
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
