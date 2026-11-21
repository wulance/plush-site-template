"use client";

import { motion } from "motion/react";
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

/** How far a design stands from the spotlight: size, height on the receding floor, and how much light reaches it. */
const places = [
  { scale: 1, lift: 0, light: 1, opacity: 1 },
  { scale: 0.5, lift: -9, light: 0.4, opacity: 1 },
  { scale: 0.33, lift: -15, light: 0.24, opacity: 1 },
  { scale: 0.24, lift: -18, light: 0.2, opacity: 0 },
];

/** How wide a toy is drawn, the one in the light and the ones standing back, so the browser fetches a copy no larger than it needs. */
const LIT_SIZES = "(min-width: 48rem) 24vw, 46vw";
const BACK_SIZES = "(min-width: 48rem) 9vw, 18vw";

/**
 * A dark stage with one spotlight. The designs stand in a row; the one in the light is shown full size
 * in a light of its own colour, and can be squeezed. The row moves only when the visitor moves it:
 * with the arrows, or by picking a toy standing further back.
 */
export function HeroStage({ items, labels }: { items: StageItem[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const { setProduct } = useInquiry();
  const count = items.length;
  const half = Math.floor(count / 2);
  const current = items[active];
  const show = (index: number) => setActive((index + count) % count);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.lineup}
      className="relative z-10 flex min-h-[25rem] flex-1 flex-col [--step:54vw] sm:[--step:34vw] md:min-h-[21rem] lg:[--step:23vw]"
      style={{ "--light": current.light } as CSSProperties}
    >
      {/* The first toy is the largest thing on the opening screen, so its picture is asked for before the scripts. */}
      <link rel="preload" as="image" href={items[0].image.src} imageSrcSet={items[0].image.srcSet} imageSizes={LIT_SIZES} fetchPriority="high" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-[45%] bottom-28 md:bottom-32">
        {/* The beam, the floor it lands on, and the pool of coloured light under the toy. */}
        <div className="absolute inset-y-0 left-1/2 w-[min(150vw,72rem)] -translate-x-1/2 blur-3xl">
          <div className="size-full bg-linear-to-b from-ink/0 via-ink/[0.09] to-ink/[0.2] [clip-path:polygon(45%_0,55%_0,80%_100%,20%_100%)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[30%] translate-y-1/2 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,color-mix(in_srgb,var(--color-ink)_16%,transparent),transparent_70%)]" />
        <div className="stage-light absolute bottom-0 left-1/2 h-[22%] w-[min(110vw,54rem)] -translate-x-1/2 translate-y-1/2 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,var(--light),transparent_68%)] opacity-60 blur-2xl" />
      </div>

      <ul className="relative min-h-0 flex-1">
        {items.map((item, i) => {
          const offset = ((i - active + count + half) % count) - half;
          const place = places[Math.min(Math.abs(offset), places.length - 1)];
          const lit = offset === 0;
          return (
            <li
              key={item.id}
              // The toys standing back are a pointer shortcut; the arrows below do the same for keyboards and screen readers.
              aria-hidden={!lit}
              className="absolute inset-y-0 left-1/2 flex w-0 origin-bottom justify-center transition-[transform,opacity,filter] duration-[900ms] ease-plush will-change-transform motion-reduce:transition-none"
              style={{
                transform: `translate(calc(var(--step) * ${offset}), ${place.lift}%) scale(${place.scale})`,
                opacity: place.opacity,
                filter: `brightness(${place.light})`,
                zIndex: count - Math.abs(offset),
                visibility: place.opacity ? undefined : "hidden",
              }}
            >
              <motion.button
                type="button"
                tabIndex={lit ? 0 : -1}
                aria-label={labels.squeeze + ": " + item.name}
                onClick={() => show(i)}
                whileHover={lit ? { scaleX: 1.03, scaleY: 0.98 } : { y: "-3%" }}
                whileTap={lit ? { scaleX: 1.14, scaleY: 0.82 } : undefined}
                transition={{ type: "spring", stiffness: 420, damping: 15 }}
                style={{ transformOrigin: "50% 100%" }}
                className="h-full shrink-0 cursor-pointer touch-manipulation rounded-3xl select-none"
              >
                <img
                  {...item.image}
                  sizes={lit ? LIT_SIZES : BACK_SIZES}
                  alt=""
                  draggable={false}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                  className="toy h-full w-auto max-w-[min(86vw,46rem)] object-contain object-bottom"
                />
              </motion.button>
            </li>
          );
        })}
      </ul>

      <div className="shell relative mt-5 flex items-center justify-center gap-3 md:mt-7 md:gap-8">
        <StepButton label={labels.prev} onClick={() => show(active - 1)} flip />
        <div key={current.id} aria-live="polite" className="min-w-0 animate-rise text-center md:w-[38rem]">
          <p className="note stage-light text-[color:var(--light)]">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · {current.code}
            <span className="max-sm:hidden"> · {current.category}</span>
          </p>
          <p className="title mt-2 text-[clamp(1.625rem,min(3.4vw,5svh),2.75rem)]">{current.name}</p>
          <ul className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-ink/75">
            {current.details.map((detail) => (
              <li key={detail} className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[var(--light)]" />
                {detail}
              </li>
            ))}
          </ul>
          <a
            href="#inquiry"
            onClick={() => setProduct(current.id)}
            className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            {labels.view}
            <Arrow className="size-3" />
          </a>
        </div>
        <StepButton label={labels.next} onClick={() => show(active + 1)} />
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
      className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full ring-1 ring-ink/25 transition-colors duration-300 ring-inset hover:bg-ink hover:text-stage"
    >
      <Arrow className={cn(flip && "-scale-x-100")} />
    </button>
  );
}
