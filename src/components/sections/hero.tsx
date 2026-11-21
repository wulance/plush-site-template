import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";
import { ButtonLink } from "@/components/ui/button";
import { Puff } from "@/components/ui/puff";
import { HeroStage, type StageItem } from "./hero-stage";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const zh = locale === "zh";
  const plain = t.lines.slice(0, -1).filter(Boolean).join(" ");
  const emphasis = t.lines[t.lines.length - 1];
  const staged = brand.products.filter((product) => product.onStage);
  const items: StageItem[] = (staged.length ? staged : brand.products).map((product) => ({
    id: product.id, name: product.name[locale], code: product.code,
    category: brand.categories.find((c) => c.id === product.category)?.name[locale] ?? "",
    details: product.details.map((detail) => detail[locale]), light: product.light, image: asset(product.image),
  }));
  const meta = [t.meta[0], t.meta[1], t.meta[2] + " " + brand.facts.founded];
  return (
    <section id="top" className="pop-hero shell">
      <ul className="note hero-meta flex justify-between gap-5">
        {meta.map((item, i) => <li key={item} className={i === 1 ? "max-md:hidden" : ""}>{item}</li>)}
      </ul>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1 aria-label={plain + (zh ? "" : " ") + emphasis} className="display hero-title">
            <span><Puff text={plain} /></span>
            <em><Puff text={emphasis} start={plain.length} /></em>
          </h1>
          <svg className="hero-spark" viewBox="0 0 100 100" fill="none" aria-hidden>
            <path d="M50 0 58 32 85 15 68 42 100 50 68 58 85 85 58 68 50 100 42 68 15 85 32 58 0 50 32 42 15 15 42 32Z" fill="currentColor" />
          </svg>
          <div className="hero-intro">
            <p className="max-w-md text-base font-medium leading-snug md:text-lg">{t.lead}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="#contact" variant="ink" size="lg">{dict.cta.brief}</ButtonLink>
              <ButtonLink href="#products" variant="ghost" size="lg" arrow={false}>{dict.cta.browse}</ButtonLink>
            </div>
          </div>
        </div>
        {items.length > 0 && <HeroStage items={items} labels={{ prev: t.prev, next: t.next, view: t.view, squeeze: t.squeeze }} />}
      </div>
    </section>
  );
}
