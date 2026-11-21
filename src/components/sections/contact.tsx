import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { picture } from "@/brand/picture";
import { CopyButton } from "./copy-button";
import { InquiryForm } from "./inquiry-form";

const digits = (value: string) => value.replace(/[^\d+]/g, "");

/** The inquiry form and every way to reach the factory. */
export function Contact({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.contact;
  const c = brand.contact;
  const details = [
    { label: t.details.email, value: c.email, href: "mailto:" + c.email },
    { label: t.details.phone, value: c.phone, href: "tel:" + digits(c.phone) },
    { label: t.details.whatsapp, value: c.whatsapp, href: "https://wa.me/" + digits(c.whatsapp).replace("+", "") },
    { label: t.details.wechat, value: c.wechat, copy: true },
    { label: t.details.address, value: c.address[locale] },
    { label: t.details.hours, value: c.hours[locale] },
  ].filter((detail) => detail.value);

  return (
    <section id="contact" className="shell scroll-mt-24 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="reveal lg:col-span-5">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="display text-[clamp(2.5rem,5vw,4.25rem)] whitespace-pre-line">{t.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-snug font-medium text-ink/85">{t.lead}</p>

          <dl className="mt-10">
            {details.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-x-4 border-t border-line py-2">
                <dt className="text-sm text-ink-soft">{detail.label}</dt>
                <dd className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 font-medium">
                  {detail.href ? (
                    <a href={detail.href} className="inline-flex min-h-11 items-center underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {detail.value}
                    </a>
                  ) : (
                    <span className={detail.copy ? "select-all" : undefined}>{detail.value}</span>
                  )}
                  {detail.copy && <CopyButton text={detail.value} label={t.copyId} done={t.copied} />}
                </dd>
              </div>
            ))}
          </dl>
          {c.wechatQr && (
            <figure className="mt-6 flex items-center gap-4">
              <img {...picture(c.wechatQr)} alt={t.qr} loading="lazy" className="size-28 rounded-2xl bg-white p-2" />
              <figcaption className="text-sm text-ink-soft">{t.qr}</figcaption>
            </figure>
          )}
        </div>

        <div className="reveal rounded-[2rem] bg-stage-deep p-6 md:rounded-[2.75rem] md:p-10 lg:col-span-7">
          <InquiryForm
            endpoint={brand.inquiryEndpoint}
            email={c.email}
            products={brand.products.map((item) => ({ id: item.id, label: item.code + " · " + item.name[locale] }))}
            labels={t.form}
          />
        </div>
      </div>
    </section>
  );
}
