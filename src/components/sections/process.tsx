import brand from "@brand";
import type { Dictionary } from "@/i18n/dictionaries";

/** The factory in numbers on a lit panel, and the five steps of an order. */
export function Process({ dict }: { dict: Dictionary }) {
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
    <section id="process" className="process-section">
      <div className="lit bg-warm py-14 md:py-20">
        <div className="shell">
          <div className="reveal">
            <p className="eyebrow mb-4">{t.eyebrow}</p>
            <h2 className="display text-[clamp(2.5rem,6vw,5rem)]">{t.title}</h2>
          </div>

          <ol className="reveal mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {t.steps.map((step, i) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="note grid size-8 shrink-0 place-items-center rounded-full bg-ink text-cool">{i + 1}</span>
                  <span className="stitch flex-1 text-ink/35" />
                </div>
                <h3 className="display mt-4 text-2xl">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-snug text-ink/75">{step.body}</p>
              </li>
            ))}
          </ol>

          <dl className="reveal mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 md:grid-cols-3 lg:grid-cols-6">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse">
                <dt className="note mt-2 text-ink/65">{fact.label}</dt>
                <dd className="display text-[clamp(2rem,3.2vw,2.875rem)] tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="note mr-2 text-ink/65">{dict.facts.tested}</span>
            {f.certifications.map((name) => (
              <span key={name} className="note rounded-full px-3 py-1.5 ring-1 ring-ink/30 ring-inset">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
