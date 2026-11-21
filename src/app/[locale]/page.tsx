import { notFound } from "next/navigation";
import brand from "@brand";
import { InquiryProvider } from "@/components/inquiry-context";
import { Contact } from "@/components/sections/contact";
import { Design } from "@/components/sections/design";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Process } from "@/components/sections/process";
import { Products } from "@/components/sections/products";
import { Proof } from "@/components/sections/proof";
import { Turntable } from "@/components/sections/turntable";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { picture } from "@/brand/picture";
import { asset } from "@/lib/asset";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const turntable = brand.turntable;
  const frame = (i: number) => turntable?.frames + "/" + String(i).padStart(2, "0") + ".webp";
  const turning = brand.products.find((product) => product.id === turntable?.product);
  const { alt, ...turntableLabels } = dict.turntable;

  return (
    <InquiryProvider>
      <Hero locale={locale} dict={dict} />
      <Marquee items={dict.marquee} labels={{ pause: dict.cta.pause, play: dict.cta.play }} />
      {turntable && (
        <Turntable
          frames={Array.from({ length: turntable.count }, (_, i) => asset(frame(i)))}
          first={picture(frame(0))}
          alt={alt(turning?.name[locale] ?? brand.name[locale])}
          labels={turntableLabels}
        />
      )}
      <Design locale={locale} dict={dict} />
      <Products locale={locale} dict={dict} />
      <Process locale={locale} dict={dict} />
      <Proof locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
    </InquiryProvider>
  );
}
