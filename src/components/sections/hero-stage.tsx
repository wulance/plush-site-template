"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { Arrow } from "@/components/ui/arrow";
import { useInquiry } from "@/components/inquiry-context";

export interface StageItem {
  id: string; name: string; code: string; category: string;
  details: string[]; light: string; image: string;
}
interface Labels { prev: string; next: string; view: string; squeeze: string }

/** A collectible's display card: each configured design takes a turn, without dimming the toys. */
export function HeroStage({ items, labels }: { items: StageItem[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const still = useReducedMotion();
  const { setProduct } = useInquiry();
  const current = items[active];
  useEffect(() => {
    if (!auto || still) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % items.length), 5200);
    return () => clearInterval(timer);
  }, [auto, still, items.length]);
  const show = (index: number) => {
    setAuto(false);
    setActive((index + items.length) % items.length);
  };
  return (
    <div className="collector-card" style={{ "--light": current.light } as CSSProperties}>
      <div className="collector-art">
        <div className="collector-halo" aria-hidden />
        <div className="note collector-edition"><span>{current.code}</span><span>{current.category}</span></div>
        <span className="collector-number" aria-hidden>{String(active + 1).padStart(2, "0")}</span>
        <span className="note squeeze-tag" aria-hidden>{labels.squeeze} ↗</span>
        {items.map((item, i) => (
          <motion.button
            key={item.id} type="button" tabIndex={i === active ? 0 : -1} aria-hidden={i !== active}
            aria-label={labels.squeeze + ": " + item.name}
            onPointerDown={() => setAuto(false)}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setAuto(false); }}
            whileHover={{ rotate: -3, scale: 1.035 }} whileTap={{ scaleX: 1.12, scaleY: 0.84 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className="collector-toy"
            style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
          >
            <img src={item.image} alt="" draggable={false} fetchPriority={i === 0 ? "high" : "auto"} className="toy size-full object-contain" />
          </motion.button>
        ))}
        <div className="collector-pips">
          {items.map((item, i) => <button key={item.id} type="button" aria-label={item.name} aria-current={i === active ? "true" : undefined} onClick={() => show(i)}><span /></button>)}
        </div>
      </div>
      <div className="collector-info">
        <div key={current.id} aria-live="polite" className="min-w-0 animate-rise">
          <p className="note mb-2 opacity-60">{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</p>
          <p className="display collector-name">{current.name}</p>
          <ul className="collector-details mt-3 text-sm">{current.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          <a href="#contact" onClick={() => setProduct(current.id)} className="note mt-4 inline-flex items-center gap-2 underline underline-offset-4">{labels.view}<Arrow className="size-3" /></a>
        </div>
        <div className="collector-arrows">
          <button type="button" aria-label={labels.prev} onClick={() => show(active - 1)}><Arrow className="-scale-x-100" /></button>
          <button type="button" aria-label={labels.next} onClick={() => show(active + 1)}><Arrow /></button>
        </div>
      </div>
    </div>
  );
}
