import brand from "@brand";
import { picture } from "@/brand/picture";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/** Evidence that the factory exists: photographs of its rooms and the names it has made toys for. Shown only when the brand has some. */
export function Proof({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.proof;
  const { photos, clients } = brand.proof;
  if (!photos.length && !clients.length) return null;

  return (
    <section id="factory" className="shell scroll-mt-24 py-16 md:py-24">
      {photos.length > 0 && (
        <>
          <div className="reveal mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-4">{t.eyebrow}</p>
              <h2 className="display text-[clamp(2.5rem,6vw,5rem)]">{t.title}</h2>
            </div>
            <p className="max-w-md text-lg leading-snug font-medium text-ink/85 lg:col-span-5 lg:justify-self-end">{t.lead}</p>
          </div>
          <ul className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.image}>
                <figure>
                  <img {...picture(photo.image)} sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw" alt="" loading="lazy" className="aspect-[4/3] w-full rounded-card object-cover" />
                  <figcaption className="mt-3 text-[0.9375rem] leading-snug font-medium text-ink/85">{photo.caption[locale]}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </>
      )}
      {clients.length > 0 && (
        <div className="reveal mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-line pt-8">
          <h3 className="eyebrow">{t.clients}</h3>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {clients.map((name) => (
              <li key={name} className="title text-xl text-ink/85">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
