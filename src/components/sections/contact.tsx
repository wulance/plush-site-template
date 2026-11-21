import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
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
    { label: t.details.wechat, value: c.wechat },
    { label: t.details.address, value: c.address[locale] },
    { label: t.details.hours, value: c.hours[locale] },
  ].filter((detail) => detail.value);

  const { subject, name, company, email, product, custom, quantity, message, messageHint, send, sending, sent, mail, failed, required } = t;

  return (
    <section id="contact" className="contact-section py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="reveal lg:col-span-5">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="display text-[clamp(2.5rem,5vw,4.25rem)]">{t.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-snug font-medium text-ink/85">{t.lead}</p>

          <dl className="mt-10">
            {details.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-t border-line py-3">
                <dt className="note pt-1 text-ink-soft">{detail.label}</dt>
                <dd className="font-medium">
                  {detail.href ? (
                    <a href={detail.href} className="underline-offset-4 hover:underline">
                      {detail.value}
                    </a>
                  ) : (
                    detail.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="inquiry-panel reveal rounded-[1.25rem] bg-stage p-6 md:p-10 lg:col-span-7">
          <InquiryForm
            endpoint={brand.inquiryEndpoint}
            email={c.email}
            products={brand.products.map((item) => ({ id: item.id, label: item.code + " · " + item.name[locale] }))}
            labels={{ subject, name, company, email, product, custom, quantity, message, messageHint, send, sending, sent, mail, failed, required }}
          />
        </div>
      </div>
    </section>
  );
}
