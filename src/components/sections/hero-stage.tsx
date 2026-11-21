"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { Arrow } from "@/components/ui/arrow";
import { useInquiry } from "@/components/inquiry-context";
import { cn } from "@/lib/cn";

export interface StageItem {
  id: string;
  name: string;
  code: string;
  category: string;
  details: string[];
  light: string;
  image: string;
}

interface Labels { prev: string; next: string; view: string; squeeze: string }

/** Each sample is presented in daylight. Selecting a swatch pauses the automatic sample change. */
export function HeroStage({ items, labels }: { items: StageItem[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const still = useReducedMotion();
  const { setProduct } = useInquiry();
  const current = items[active];

  useEffect(() => {
    if (!auto || still || items.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [auto, still, items.length]);

  const show = (index: number) => {
    setAuto(false);
    setActive((index + items.length) % items.length);
  };

  return (
    <div className="studio-sample relative min-w-0" onFocusCapture={() => setAuto(false)} style={{ "--light": current.light } as CSSProperties}>
      <div className="sample-paper sheet relative isolate">
        <span aria-hidden className="sample-tape" />
        <div aria-hidden className="sample-oval" />
        <span className="note absolute top-6 left-6 text-ink-soft">{current.code}</span>
        <span className="note absolute top-6 right-6 text-ink-soft">{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <motion.button
          key={current.id}
          type="button"
          aria-label={labels.squeeze + ": " + current.name}
          onClick={() => setAuto(false)}
          initial={still ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={still ? undefined : { y: -5 }}
          whileTap={still ? undefined : { scaleX: 1.08, scaleY: 0.9 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 block size-full cursor-pointer touch-manipulation px-10 pt-10 pb-5 md:pt-12 md:pb-6"
        >
          <img src={current.image} alt="" draggable={false} fetchPriority="high" className="toy size-full object-contain" />
        </motion.button>
        <div aria-hidden className="sample-seal text-accent">
          <svg viewBox="0 0 68 68" fill="none" className="size-full">
            <circle cx="34" cy="34" r="31" stroke="currentColor" strokeDasharray="2 3" />
            <path d="m23 37 8 7 16-21M20 18l3-4m22 38 3-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 md:mt-6" aria-live="polite">
        <div className="min-w-0">
          <p className="note text-ink-soft">{current.category}</p>
          <h2 className="display mt-1 text-[1.875rem]">{current.name}</h2>
        </div>
        <div className="flex gap-2 pt-1">
          <StepButton label={labels.prev} onClick={() => show(active - 1)} flip />
          <StepButton label={labels.next} onClick={() => show(active + 1)} />
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-relaxed text-ink-soft">
        {current.details.map((detail) => <li key={detail} className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-accent/50" />{detail}</li>)}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <button key={item.id} type="button" aria-label={item.name} aria-pressed={i === active} onClick={() => show(i)} className={cn("grid size-10 cursor-pointer place-items-center rounded-full border transition-colors", i === active ? "border-accent bg-warm/40" : "border-transparent hover:border-line")}>
              <img src={item.image} alt="" className="size-8 object-contain p-0.5" />
            </button>
          ))}
        </div>
        <a href="#contact" onClick={() => setProduct(current.id)} className="note inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline">{labels.view}<Arrow className="size-3" /></a>
      </div>
    </div>
  );
}

function StepButton({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-ink hover:text-stage"><Arrow className={cn("size-4", flip && "-scale-x-100")} /></button>;
}
