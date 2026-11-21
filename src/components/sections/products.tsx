import brand from "@brand";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { asset } from "@/lib/asset";
import { ProductGrid, type ProductCard } from "./product-grid";

export function Products({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.products;
  const moq = brand.facts.moq.toLocaleString("en-US") + " " + t.pieces;
  const products: ProductCard[] = brand.products.map((product) => ({
    id: product.id,
    code: product.code,
    name: product.name[locale],
    category: product.category,
    image: asset(product.image),
    light: product.light,
    specs: [
      { label: t.height, value: product.heightCm + " cm" },
      { label: t.material, value: product.material[locale] },
      { label: t.moq, value: moq },
    ],
  }));

  return (
    <section id="products" className="shell py-20 md:py-28">
      <div className="reveal mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="display text-[clamp(2.5rem,6vw,5rem)]">{t.title}</h2>
        </div>
        <p className="max-w-md text-lg leading-snug font-medium text-ink/85 lg:col-span-5 lg:justify-self-end">{t.lead}</p>
      </div>
      <ProductGrid
        products={products}
        categories={brand.categories.map((c) => ({ id: c.id, name: c.name[locale] }))}
        labels={{ all: t.all, ask: t.ask }}
      />
    </section>
  );
}
