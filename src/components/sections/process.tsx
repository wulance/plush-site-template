import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";

/** How an order runs, on a tinted band: the five steps, the factory in numbers, what it is tested to, and the terms. */
export function Process({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.process;
  const f = brand.facts;
  const number = (value: number) => value.toLocaleString("en-US");
  const facts = [
    { label: dict.facts.founded, value: String(f.founded) },
    { label: dict.facts.workers, value: number(f.workers) },
    { label: dict.facts.capacity, value: number(f.monthlyCapacity) },
    { label: dict.facts.moq, value: number(f.moq) },
    { label: dict.facts.sample, value: number(f.sampleDays) },
    { label: dict.facts.bulk, value: number(f.bulkDays) },
  ];

  return (
    <section id="process" className="py-10">
      <div className="lit border-y border-line bg-cool/60 py-14 md:py-20">
        <div className="shell">
          <div className="reveal">
            <p className="eyebrow mb-4">{t.eyebrow}</p>
            <h2 className="display text-[clamp(2.5rem,6vw,5rem)] whitespace-pre-line">{t.title}</h2>
          </div>

          <ol className="reveal mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {t.steps.map((step, i) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-stage tabular-nums">{i + 1}</span>
                  <span className="stitch flex-1 text-ink/35" />
                </div>
                <h3 className="title mt-4 text-2xl">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-snug text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>

          <dl className="reveal mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 md:grid-cols-3 lg:grid-cols-6">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-sm font-medium text-ink-soft">{fact.label}</dt>
                <dd className="display text-[clamp(2rem,3.2vw,2.875rem)] tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {f.certifications.length > 0 && (
            <div className="reveal mt-12 border-t border-line pt-8">
              <h3 className="eyebrow">{dict.facts.tested}</h3>
              <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                {f.certifications.map((item) => (
                  <li key={item.name}>
                    <p className="title text-xl">{item.name}</p>
                    {item.scope && <p className="mt-1 text-sm text-ink-soft">{item.scope[locale]}</p>}
                    {item.file && (
                      <a href={asset(item.file)} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
                        {dict.facts.report}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {brand.terms.length > 0 && (
            <div className="reveal mt-12 border-t border-line pt-8">
              <h3 className="eyebrow">{t.terms}</h3>
              <dl className="mt-4 grid gap-x-10 md:grid-cols-2">
                {brand.terms.map((term) => (
                  <div key={term.label.en} className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-line py-3 text-[0.9375rem] leading-snug">
                    <dt className="text-ink-soft">{term.label[locale]}</dt>
                    <dd className="font-medium">{term.value[locale]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
