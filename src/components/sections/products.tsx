import brand from "@brand";
import { picture } from "@/brand/picture";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProductGrid, type ProductCard } from "./product-grid";

export function Products({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.products;
  const products: ProductCard[] = brand.products.map((product) => {
    const moq = { label: t.moq, value: (product.moq ?? brand.facts.moq).toLocaleString("en-US") + " " + t.pieces };
    const height = { label: t.height, value: product.heightCm + " cm" };
    const material = { label: t.material, value: product.material[locale] };
    const lead = { label: t.lead_, value: t.days(product.leadDays ?? brand.facts.bulkDays) };
    const category = brand.categories.find((c) => c.id === product.category);
    return {
      id: product.id,
      code: product.code,
      name: product.name[locale],
      category: product.category,
      image: picture(product.image),
      light: product.light,
      specs: [height, material, moq],
      sheet: [
        ...(category ? [{ label: t.category, value: category.name[locale] }] : []),
        height,
        material,
        ...(product.age ? [{ label: t.age, value: product.age[locale] }] : []),
        moq,
        lead,
        { label: dict.facts.tested, value: brand.facts.certifications.map((c) => c.name).join(", ") },
      ],
      details: product.details.map((detail) => detail[locale]),
      views: (product.views ?? []).map((item) => ({ image: picture(item.image), caption: item.caption[locale] })),
    };
  });

  return (
    <section id="products" className="shell scroll-mt-24 py-20 md:py-28">
      <div className="reveal mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="display text-[clamp(2.5rem,6vw,5rem)] whitespace-pre-line">{t.title}</h2>
        </div>
        <p className="max-w-md text-lg leading-snug font-medium text-ink/85 lg:col-span-5 lg:justify-self-end">{t.lead}</p>
      </div>
      <ProductGrid
        products={products}
        categories={brand.categories.map((c) => ({ id: c.id, name: c.name[locale] }))}
        labels={{ all: t.all, filter: t.filter, ask: t.ask, details: t.details, close: t.close }}
      />
    </section>
  );
}
