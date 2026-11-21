import brand from "@brand";
import { picture } from "@/brand/picture";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SketchToToy, type SketchDesign } from "./sketch-to-toy";

/** Design capability: a drawing becoming a toy, the four steps in between, and one order followed through them. */
export function Design({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.design;
  const designs: SketchDesign[] = brand.products.flatMap((product) =>
    product.sketch
      ? [
          {
            id: product.id,
            name: product.name[locale],
            code: product.code,
            light: product.light,
            image: picture(product.image),
            sketch: picture(product.sketch),
            details: product.details.map((detail) => detail[locale]),
          },
        ]
      : [],
  );
  if (!designs.length) return null;
  const story = brand.caseStudy;

  return (
    <section id="design" className="shell scroll-mt-24 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="reveal lg:col-span-5 lg:pt-4">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="display text-[clamp(2.5rem,5vw,4.25rem)] whitespace-pre-line">{t.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-snug font-medium text-ink/85">{t.lead}</p>

          <ol className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
            {t.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.75rem_1fr] gap-x-3 border-t border-line py-4">
                <span className="note pt-1.5 text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-semibold">
                    {step.title}
                    {i === 2 && <span className="ml-3 rounded-full bg-warm px-2.5 py-1 align-middle text-[0.8125rem] font-semibold text-stage">{t.sampleIn(brand.facts.sampleDays)}</span>}
                  </h3>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="reveal lg:col-span-7">
          <SketchToToy designs={designs} labels={{ drag: t.drag, sketch: t.sketch, toy: t.toy, pick: t.pick, decided: t.decided }} />
        </div>
      </div>

      {story && (
        <div className="reveal mt-16 md:mt-24">
          <h3 className="title max-w-2xl text-3xl md:text-4xl">{story.title[locale]}</h3>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {story.steps.map((step, i) => (
              <li key={step.image} className="flex flex-col overflow-hidden rounded-card bg-stage-deep">
                <img {...picture(step.image)} sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw" alt="" loading="lazy" className="aspect-[4/3] w-full bg-[#f6efdf] object-cover" />
                <div className="p-5">
                  <p className="note text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h4 className="mt-2 text-lg font-semibold">{step.title[locale]}</h4>
                  <p className="mt-1 text-[0.9375rem] leading-snug text-ink-soft">{step.note[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
