import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { picture } from "@/brand/picture";
import { ButtonLink } from "@/components/ui/button";
import { HeroStage, type StageItem } from "./hero-stage";

/** First screen: the claim set like the opening of a catalogue, beside the current sample on a sheet of pattern paper. */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const plain = t.lines.slice(0, -1).filter(Boolean).join(" ");
  const emphasis = t.lines[t.lines.length - 1];

  const staged = brand.products.filter((product) => product.onStage);
  const items: StageItem[] = (staged.length ? staged : brand.products).map((product) => ({
    id: product.id,
    name: product.name[locale],
    code: product.code,
    category: brand.categories.find((c) => c.id === product.category)?.name[locale] ?? "",
    details: product.details.map((detail) => detail[locale]),
    light: product.light,
    image: picture(product.image),
  }));

  const meta = [t.meta[0], t.meta[1], t.meta[2] + " " + brand.facts.founded];

  return (
    <section id="top" className="studio-hero overflow-hidden">
      <div className="shell">
        <ul className="note flex flex-wrap justify-between gap-3 border-b border-line py-3 text-ink-soft md:py-5">
          {meta.map((item, i) => (
            <li key={item} className={i === 1 ? "max-sm:hidden" : ""}>
              {item}
            </li>
          ))}
        </ul>
        <div className="grid items-center gap-8 py-8 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-20">
          <div className="relative z-10">
            {/* A loose thread, drawn by hand. */}
            <svg aria-hidden viewBox="0 0 76 44" fill="none" className="mb-7 hidden h-11 w-[76px] text-accent md:block">
              <path d="M3 29c17-24 25-25 29-12 5 16-12 25-12 13S50-2 54 8c4 8-15 33-9 29 11-7 17-7 28-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <h1 className="display text-[3.4rem] md:text-[clamp(4rem,8vw,7.5rem)]">
              {plain}
              <br />
              <em>{emphasis}</em>
            </h1>
            <p className="mt-5 max-w-[26rem] leading-relaxed text-ink-soft md:mt-7 md:text-lg">{t.lead}</p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-9">
              <ButtonLink href="#inquiry" variant="primary" size="lg" className="max-md:h-12 max-md:px-6">
                {dict.cta.brief}
              </ButtonLink>
              <ButtonLink href="#products" variant="ghost" size="lg" arrow={false} className="max-md:h-12 max-md:px-6">
                {dict.cta.browse}
              </ButtonLink>
            </div>
          </div>
          {items.length > 0 && (
            <HeroStage items={items} labels={{ lineup: t.lineup, prev: t.prev, next: t.next, view: t.view, squeeze: t.squeeze }} />
          )}
        </div>
      </div>
    </section>
  );
}
