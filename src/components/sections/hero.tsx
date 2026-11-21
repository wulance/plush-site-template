import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { picture } from "@/brand/picture";
import { ButtonLink } from "@/components/ui/button";
import { Puff } from "@/components/ui/puff";
import { HeroStage, type StageItem } from "./hero-stage";

/** First screen: the claim in stuffed letters across a dark stage, and the designs taking turns in front of it. */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const zh = locale === "zh";
  const [plain, emphasis] = [t.lines.slice(0, -1).filter(Boolean).join(" "), t.lines[t.lines.length - 1]];

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
    <section id="top" className="relative overflow-hidden">
      {/* The toy in the spotlight is the largest thing on the first screen: it is fetched before the page asks for it. */}
      <div className="relative flex min-h-[calc(100svh-5.5rem)] flex-col pt-6 pb-8 md:pt-8 md:pb-10">
        <ul className="note shell relative z-20 flex flex-wrap justify-between gap-x-8 gap-y-1 text-ink/75">
          {meta.map((item, i) => (
            <li key={item} className={i === 1 ? "max-md:hidden" : ""}>
              {item}
            </li>
          ))}
        </ul>

        {/* The toy in the spotlight stands in front of the headline. */}
        <h1
          aria-label={plain + (zh ? "" : " ") + emphasis}
          className={
            "display pointer-events-none relative mt-5 text-center md:mt-6 " +
            (zh
              ? "text-[clamp(3.5rem,21vw,7rem)] leading-[1.06] md:text-[min(11.5vw,24svh)]"
              : "text-[clamp(3.25rem,17vw,6.5rem)] leading-[0.86] md:text-[min(11vw,24svh)]")
          }
        >
          <Puff text={plain} />
          <br className="md:hidden" />
          {!zh && <span className="max-md:hidden"> </span>}
          <em>
            <Puff text={emphasis} start={plain.length} />
          </em>
        </h1>

        {/* On a phone the toy stands under the headline; from a tablet up it steps in front of it. */}
        <div className="relative z-10 mt-4 flex flex-1 flex-col md:-mt-[2vw]">
          {items.length > 0 && (
            <HeroStage items={items} labels={{ lineup: t.lineup, prev: t.prev, next: t.next, view: t.view, squeeze: t.squeeze }} />
          )}
        </div>

        <div className="shell relative z-20 mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <p className="max-w-md text-[1.0625rem] leading-snug font-medium text-ink/85 max-lg:order-last md:text-lg lg:max-w-[34rem]">{t.lead}</p>
          <div className="flex flex-wrap gap-3 lg:shrink-0 lg:flex-nowrap">
            <ButtonLink href="#inquiry" variant="primary" size="lg">
              {dict.cta.brief}
            </ButtonLink>
            <ButtonLink href="#products" variant="ink" size="lg" arrow={false}>
              {dict.cta.browse}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
