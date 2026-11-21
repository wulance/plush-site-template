import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Logo } from "@/components/ui/logo";
import { asset } from "@/lib/asset";
import { sectionLinks } from "./site-header";

const link = "inline-flex min-h-11 items-center underline-offset-4 hover:underline md:min-h-8";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.footer;
  const c = brand.contact;
  const columns = [
    { title: t.explore, links: sectionLinks(dict) },
    {
      title: t.reach,
      links: [
        ...(c.email ? [{ href: "mailto:" + c.email, label: c.email }] : []),
        ...(c.phone ? [{ href: "tel:" + c.phone.replace(/[^\d+]/g, ""), label: c.phone }] : []),
      ],
      text: c.address[locale],
    },
    { title: t.follow, links: brand.socials },
  ].filter((column) => column.links.length);

  return (
    <footer className="shell pt-10 pb-10">
      <div className="stitch text-ink/25" />
      <div className="grid gap-10 pt-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo locale={locale} />
          <p className="mt-5 max-w-xs text-[0.9375rem] leading-snug text-ink-soft">{dict.meta.description}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 md:col-span-8">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="eyebrow mb-2">{column.title}</h2>
              <ul className="text-[0.9375rem]">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={link}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              {column.text && <p className="mt-2 max-w-[16rem] text-[0.9375rem] leading-snug text-ink-soft">{column.text}</p>}
            </nav>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-x-8 gap-y-2 border-t border-line pt-6 text-sm text-ink-soft md:flex-row md:flex-wrap md:items-center">
        <p>
          © {new Date().getFullYear()} {brand.legalName[locale]}
          {locale === "zh" ? " " : ". "}
          {t.rights}
        </p>
        {brand.legal.registration && <p>{brand.legal.registration[locale]}</p>}
        {brand.legal.links.map((item) => (
          <a key={item.href} href={asset(item.href)} className={link}>
            {item.label[locale]}
          </a>
        ))}
        <a href="#top" className={link + " text-ink md:ml-auto"}>
          {t.top} ↑
        </a>
      </div>
    </footer>
  );
}
