"use client";

import { useState, type CSSProperties } from "react";
import { Arrow } from "@/components/ui/arrow";
import { useInquiry } from "@/components/inquiry-context";
import { cn } from "@/lib/cn";

export interface ProductCard {
  id: string;
  code: string;
  name: string;
  category: string;
  image: string;
  light: string;
  specs: { label: string; value: string }[];
}

interface Props {
  products: ProductCard[];
  categories: { id: string; name: string }[];
  labels: { all: string; ask: string };
}

/** The range as cards, each toy in a light of its own colour, with a filter by category. */
export function ProductGrid({ products, categories, labels }: Props) {
  const [category, setCategory] = useState("");
  const { setProduct } = useInquiry();
  const shown = products.filter((product) => !category || product.category === category);
  const used = categories.filter((c) => products.some((product) => product.category === c.id));

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {[{ id: "", name: labels.all }, ...used].map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className={cn(
              "h-10 cursor-pointer rounded-full px-4 text-sm font-medium ring-1 transition-colors duration-300 ring-inset",
              category === item.id ? "bg-ink text-stage ring-ink" : "ring-ink/20 hover:ring-ink/60",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((product) => (
          <li
            key={product.id}
            style={{ "--light": product.light } as CSSProperties}
            className="group relative isolate flex animate-rise flex-col overflow-hidden rounded-card bg-stage-deep"
          >
            <div className="relative aspect-[4/3.6]">
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/3 translate-y-1/3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,var(--light),transparent_70%)] opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
              />
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="toy absolute inset-0 size-full object-contain object-bottom px-8 pt-8 transition-transform duration-700 ease-plush group-hover:scale-[1.06]"
              />
              <span className="note absolute top-5 left-5 text-[color:var(--light)]">{product.code}</span>
            </div>
            <div className="flex flex-1 flex-col p-6 pt-5">
              <h3 className="display text-[1.75rem]">{product.name}</h3>
              <dl className="mt-4 grid gap-1.5 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 border-t border-line pt-1.5">
                    <dt className="text-ink-soft">{spec.label}</dt>
                    <dd className="text-right font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="#contact"
                onClick={() => setProduct(product.id)}
                className="note mt-5 inline-flex items-center gap-1.5 self-start underline-offset-4 after:absolute after:inset-0 hover:underline"
              >
                {labels.ask}
                <Arrow className="size-3" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
