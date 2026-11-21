"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { Arrow } from "@/components/ui/arrow";
import { useInquiry } from "@/components/inquiry-context";
import type { Pic } from "@/brand/picture";
import { cn } from "@/lib/cn";

export interface StageItem {
  id: string;
  name: string;
  code: string;
  category: string;
  details: string[];
  light: string;
  image: Pic;
}

interface Labels {
  lineup: string;
  prev: string;
  next: string;
  view: string;
  squeeze: string;
}

/** How wide the sample and its thumbnails are drawn, so the browser fetches a copy no larger than it needs. */
const SAMPLE_SIZES = "(min-width: 64rem) 24vw, (min-width: 48rem) 30vw, 46vw";
const THUMB_SIZES = "2.25rem";

/**
 * The sample sheet: one design at a time on pattern paper, taped at the top, in a tint of its own colour.
 * It can be squeezed. The sample changes only when the visitor changes it, with the arrows or by picking
 * a thumbnail, so nothing moves while they read.
 */
export function HeroStage({ items, labels }: { items: StageItem[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const still = useReducedMotion();
  const { setProduct } = useInquiry();
  const count = items.length;
  const current = items[active];
  const show = (index: number) => setActive((index + count) % count);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.lineup}
      className="relative min-w-0"
      style={{ "--light": current.light } as CSSProperties}
    >
      {/* The first sample is the largest picture on the opening screen, so it is asked for before the scripts. */}
      <link rel="preload" as="image" href={items[0].image.src} imageSrcSet={items[0].image.srcSet} imageSizes={SAMPLE_SIZES} fetchPriority="high" />
      <div className="sample-paper sheet stage-light relative isolate">
        <span aria-hidden className="sample-tape" />
        <div aria-hidden className="sample-oval" />
        <span className="note absolute top-6 left-6 text-ink-soft">{current.code}</span>
        <span className="note absolute top-6 right-6 text-ink-soft">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
        <motion.button
          key={current.id}
          type="button"
          aria-label={labels.squeeze + ": " + current.name}
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={still ? undefined : { y: -5 }}
          whileTap={still ? undefined : { scaleX: 1.08, scaleY: 0.9 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: "50% 100%" }}
          className="relative z-10 block size-full cursor-pointer touch-manipulation rounded-lg px-10 pt-10 pb-5 select-none md:pt-12 md:pb-6"
        >
          <img
            {...current.image}
            sizes={SAMPLE_SIZES}
            alt=""
            draggable={false}
            fetchPriority={active === 0 ? "high" : undefined}
            className="toy size-full object-contain"
          />
        </motion.button>
        {/* The approval stamp a sealed sample carries. */}
        <svg aria-hidden viewBox="0 0 68 68" fill="none" className="sample-seal text-accent">
          <circle cx="34" cy="34" r="31" stroke="currentColor" strokeDasharray="2 3" />
          <path d="m23 37 8 7 16-21M20 18l3-4m22 38 3-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 md:mt-6">
        <div aria-live="polite" className="min-w-0">
          <p className="note text-ink-soft">{current.category}</p>
          <p className="title mt-1.5 text-[1.75rem]">{current.name}</p>
        </div>
        <div className="flex gap-2">
          <StepButton label={labels.prev} onClick={() => show(active - 1)} flip />
          <StepButton label={labels.next} onClick={() => show(active + 1)} />
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
        {current.details.map((detail) => (
          <li key={detail} className="flex items-center gap-1.5">
            <span className="size-1 rounded-full bg-accent/60" />
            {detail}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line pt-3">
        <ul className="flex flex-wrap gap-1">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={item.name}
                aria-pressed={i === active}
                onClick={() => show(i)}
                className={cn(
                  "grid size-11 cursor-pointer place-items-center rounded-full border transition-colors",
                  i === active ? "border-accent bg-warm/50" : "border-transparent hover:border-ink/30",
                )}
              >
                <img {...item.image} sizes={THUMB_SIZES} alt="" loading="lazy" className="size-9 object-contain p-0.5" />
              </button>
            </li>
          ))}
        </ul>
        <a
          href="#inquiry"
          onClick={() => setProduct(current.id)}
          className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          {labels.view}
          <Arrow className="size-3" />
        </a>
      </div>
    </div>
  );
}

function StepButton({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-ink/30 transition-colors duration-300 hover:bg-ink hover:text-stage"
    >
      <Arrow className={cn("size-4", flip && "-scale-x-100")} />
    </button>
  );
}
