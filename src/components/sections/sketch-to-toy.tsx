"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Pic } from "@/brand/picture";
import { cn } from "@/lib/cn";

export interface SketchDesign {
  id: string;
  name: string;
  code: string;
  light: string;
  image: Pic;
  sketch: Pic;
  details: string[];
}

interface Labels {
  drag: string;
  sketch: string;
  toy: string;
  pick: string;
  decided: string;
}

const SIZES = "(min-width: 64rem) 50vw, 90vw";

/**
 * One design as a drawing and as the finished toy, in the same pose. A line across the picture divides
 * the two; dragging it sideways (or the arrow keys) pulls the sketch back over the toy or lets the toy
 * through. A swipe up or down over the picture scrolls the page and leaves the line where it is.
 */
export function SketchToToy({ designs, labels }: { designs: SketchDesign[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(50);
  const press = useRef<{ x: number; moved: boolean } | null>(null);
  const design = designs[index];

  const place = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setSplit(Math.round(Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100))));
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    press.current = { x: event.clientX, moved: event.pointerType === "mouse" };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (press.current.moved) place(event);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!press.current) return;
    // A finger has to travel sideways before the line follows it: until then it may be starting a scroll.
    if (!press.current.moved && Math.abs(event.clientX - press.current.x) < 8) return;
    press.current.moved = true;
    place(event);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (press.current && !press.current.moved) place(event);
    press.current = null;
  };

  return (
    <div style={{ "--light": design.light, "--split": split + "%" } as CSSProperties}>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (press.current = null)}
        className="stage-light relative isolate aspect-square cursor-ew-resize touch-pan-y overflow-hidden rounded-lg border border-line bg-stage-deep select-none"
      >
        {/* The finished toy, against a tint of its own colour. */}
        <div aria-hidden className="stage-light absolute inset-x-0 bottom-0 h-1/2 translate-y-1/3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,var(--light),transparent_70%)] opacity-20 blur-2xl" />
        <img key={design.image.src} {...design.image} sizes={SIZES} alt={design.name} loading="lazy" draggable={false} className="toy absolute inset-0 size-full animate-rise object-contain p-[7%]" />

        {/* The drawing lies over it, up to the dividing line. */}
        <div className="absolute inset-0 bg-[#f6efdf] [clip-path:inset(0_calc(100%-var(--split))_0_0)]">
          <img key={design.sketch.src} {...design.sketch} sizes={SIZES} alt="" loading="lazy" draggable={false} className="absolute inset-0 size-full object-contain p-[7%] mix-blend-multiply" />
        </div>

        <span className={cn("note absolute top-5 left-5 rounded-full bg-stage/85 px-3 py-1.5 text-ink transition-opacity md:top-7 md:left-7", split < 16 && "opacity-0")}>
          {labels.sketch}
        </span>
        <span className={cn("note absolute top-5 right-5 rounded-full bg-ink px-3 py-1.5 text-stage transition-opacity md:top-7 md:right-7", split > 84 && "opacity-0")}>
          {labels.toy}
        </span>

        {/* The keyboard's handle on the line: a slider that shows its focus on the round grip. */}
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-label={labels.drag}
          aria-valuetext={`${labels.sketch} ${split}%, ${labels.toy} ${100 - split}%`}
          className="peer sr-only"
        />
        <div aria-hidden className="group pointer-events-none absolute inset-y-0 left-[var(--split)] w-0 peer-focus-visible:[--ring:4px]">
          <div className="stitch-y absolute inset-y-0 -left-px text-ink/35" />
          <div className="absolute top-1/2 left-0 grid size-12 -translate-1/2 place-items-center rounded-full bg-accent text-on-accent shadow-[0_0_0_var(--ring,0px)_var(--color-ink),0_0_0_calc(var(--ring,0px)*2)_var(--color-stage),0_8px_24px_-6px_rgb(0_0_0/0.16)]">
            <svg viewBox="0 0 20 20" fill="none" className="size-5">
              <path d="m7 5-4 5 4 5M13 5l4 5-4 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div role="group" aria-label={labels.pick} className="mt-4 flex gap-2 sm:gap-3">
        {designs.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg p-2 text-left ring-1 transition-colors duration-300 ring-inset max-sm:flex-col max-sm:text-center sm:gap-3 sm:pr-3",
              i === index ? "bg-ink text-stage ring-ink" : "ring-ink/30 hover:ring-ink/60",
            )}
          >
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-[#f6efdf]">
              <img {...item.sketch} sizes="3rem" alt="" loading="lazy" className="size-full object-contain p-1 mix-blend-multiply" />
            </span>
            <span className="min-w-0">
              <span className="note block max-sm:hidden">{item.code}</span>
              <span className="block text-[0.8125rem] leading-tight font-semibold sm:truncate sm:text-sm">{item.name}</span>
            </span>
          </button>
        ))}
      </div>

      <div key={design.id} className="mt-6 animate-rise">
        <h3 className="eyebrow">
          {labels.decided} · {design.name}
        </h3>
        <ul className="mt-3 grid gap-x-6 sm:grid-cols-3">
          {design.details.map((detail) => (
            <li key={detail} className="flex gap-2.5 border-t border-line py-3 text-[0.9375rem] leading-snug font-medium">
              <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-accent/60" />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
