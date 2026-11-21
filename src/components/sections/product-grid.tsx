"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Arrow } from "@/components/ui/arrow";
import { buttonClass } from "@/components/ui/button";
import { useInquiry } from "@/components/inquiry-context";
import type { Pic } from "@/brand/picture";
import { cn } from "@/lib/cn";

export interface ProductCard {
  id: string;
  code: string;
  name: string;
  category: string;
  image: Pic;
  light: string;
  /** The few facts shown on the card. */
  specs: { label: string; value: string }[];
  /** Everything known about the design, for its detail view. */
  sheet: { label: string; value: string }[];
  details: string[];
  views: { image: Pic; caption: string }[];
}

interface Props {
  products: ProductCard[];
  categories: { id: string; name: string }[];
  labels: { all: string; filter: string; ask: string; details: string; close: string };
}

const HASH = "#p-";

/**
 * The range as cards, each toy in a light of its own colour, with a filter by category. A card opens
 * the design's detail view: its other pictures and its full sheet. The view has an address of its own
 * (#p-<id>), so a buyer can send a colleague straight to one design.
 */
export function ProductGrid({ products, categories, labels }: Props) {
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState<ProductCard | null>(null);
  const [view, setView] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const { setProduct } = useInquiry();
  const shown = products.filter((product) => !category || product.category === category);
  const used = categories.filter((c) => products.some((product) => product.category === c.id));

  useEffect(() => {
    const fromAddress = () => {
      const product = products.find((item) => HASH + item.id === window.location.hash);
      if (product) show(product);
    };
    fromAddress();
    window.addEventListener("hashchange", fromAddress);
    return () => window.removeEventListener("hashchange", fromAddress);
  }, [products]);

  function show(product: ProductCard) {
    setOpen(product);
    setView(0);
    if (!dialog.current?.open) dialog.current?.showModal();
    if (window.location.hash !== HASH + product.id) window.history.replaceState(null, "", HASH + product.id);
  }
  function close() {
    dialog.current?.close();
  }
  function onClose() {
    if (window.location.hash.startsWith(HASH)) window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  const pictures = open ? [{ image: open.image, caption: open.name }, ...open.views] : [];

  return (
    <>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        {[{ id: "", name: labels.all }, ...used].map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className={cn(
              "h-11 cursor-pointer rounded-full px-4 text-[0.9375rem] font-medium ring-1 transition-colors duration-300 ring-inset",
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
                {...product.image}
                sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw"
                alt=""
                loading="lazy"
                className="toy absolute inset-0 size-full object-contain object-bottom px-8 pt-8 transition-transform duration-700 ease-plush group-hover:scale-[1.06]"
              />
              <span className="note absolute top-5 left-5 text-[color:var(--light)]">{product.code}</span>
              {product.views.length > 0 && (
                <span className="absolute top-4 right-4 rounded-full bg-stage/70 px-2.5 py-1 text-xs font-semibold tabular-nums">+{product.views.length}</span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6 pt-5">
              <h3 className="title text-2xl">
                {/* The whole card opens the detail view; the quote link sits above it. */}
                <button type="button" onClick={() => show(product)} className="cursor-pointer text-left after:absolute after:inset-0">
                  {product.name}
                </button>
              </h3>
              <dl className="mt-4 grid gap-1.5 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 border-t border-line pt-1.5">
                    <dt className="text-ink-soft">{spec.label}</dt>
                    <dd className="text-right font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex items-center justify-between gap-4 text-[0.9375rem] font-semibold">
                <span aria-hidden className="text-ink-soft">
                  {labels.details}
                </span>
                <a
                  href="#inquiry"
                  onClick={() => setProduct(product.id)}
                  className="relative z-10 inline-flex min-h-11 items-center gap-1.5 underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                >
                  {labels.ask}
                  <Arrow className="size-3" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={onClose}
        onClick={(event) => event.target === dialog.current && close()}
        aria-labelledby="product-title"
        style={{ "--light": open?.light } as CSSProperties}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(100vw-1.5rem,64rem)] overflow-y-auto rounded-[2rem] bg-stage-deep text-ink shadow-2xl ring-1 ring-ink/10 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="grid md:grid-cols-2">
            <div className="p-4">
              <div className="relative isolate aspect-square overflow-hidden rounded-3xl bg-stage">
                <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/3 translate-y-1/3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,var(--light),transparent_70%)] opacity-50 blur-2xl" />
                <img
                  key={pictures[view].image.src}
                  {...pictures[view].image}
                  sizes="(min-width: 48rem) 30rem, 90vw"
                  alt={pictures[view].caption}
                  className="toy absolute inset-0 size-full animate-rise object-contain p-6"
                />
              </div>
              {pictures.length > 1 && (
                <>
                  <p className="mt-3 px-1 text-sm text-ink-soft">{pictures[view].caption}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pictures.map((item, i) => (
                      <button
                        key={item.image.src}
                        type="button"
                        aria-label={item.caption}
                        aria-pressed={i === view}
                        onClick={() => setView(i)}
                        className={cn("size-16 cursor-pointer overflow-hidden rounded-xl bg-stage ring-2 ring-inset", i === view ? "ring-ink" : "ring-transparent hover:ring-ink/40")}
                      >
                        <img {...item.image} sizes="4rem" alt="" loading="lazy" className="size-full object-contain p-1.5" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col p-6 md:p-8 md:pl-4">
              <div className="flex items-start justify-between gap-4">
                <p className="note pt-3 text-[color:var(--light)]">{open.code}</p>
                <button
                  type="button"
                  onClick={close}
                  aria-label={labels.close}
                  className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full ring-1 ring-ink/25 ring-inset hover:bg-ink hover:text-stage"
                >
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
                    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <h3 id="product-title" className="title mt-1 text-3xl md:text-4xl">
                {open.name}
              </h3>
              <ul className="mt-5 grid gap-2">
                {open.details.map((detail) => (
                  <li key={detail} className="flex gap-2.5 leading-snug font-medium">
                    <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-[var(--light)]" />
                    {detail}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid gap-1.5 text-[0.9375rem]">
                {open.sheet.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-6 border-t border-line pt-1.5">
                    <dt className="shrink-0 text-ink-soft">{spec.label}</dt>
                    <dd className="text-right font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="#inquiry"
                onClick={() => {
                  setProduct(open.id);
                  close();
                }}
                className={buttonClass("primary", "lg", "mt-8 self-start")}
              >
                {labels.ask}
                <Arrow />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
