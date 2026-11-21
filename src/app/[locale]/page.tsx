import { notFound } from "next/navigation";
import brand from "@brand";
import { InquiryProvider } from "@/components/inquiry-context";
import { Contact } from "@/components/sections/contact";
import { Design } from "@/components/sections/design";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Process } from "@/components/sections/process";
import { Products } from "@/components/sections/products";
import { Turntable } from "@/components/sections/turntable";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { frames, count, width, height } = brand.turntable;

  return (
    <InquiryProvider>
      <Hero locale={locale} dict={dict} />
      <Marquee items={dict.marquee} />
      <Turntable
        frames={Array.from({ length: count }, (_, i) => asset(frames + "/" + String(i).padStart(2, "0") + ".webp"))}
        size={{ width, height }}
        labels={dict.turntable}
      />
      <Design locale={locale} dict={dict} />
      <Products locale={locale} dict={dict} />
      <Process dict={dict} />
      <Contact locale={locale} dict={dict} />
    </InquiryProvider>
  );
}
