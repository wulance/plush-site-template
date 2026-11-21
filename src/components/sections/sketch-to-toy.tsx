"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

export interface SketchDesign {
  id: string;
  name: string;
  code: string;
  light: string;
  image: string;
  sketch: string;
}

interface Labels {
  drag: string;
  sketch: string;
  toy: string;
  pick: string;
}

/**
 * One design as a drawing and as the finished toy, in the same pose. A line across the picture divides
 * the two; dragging it (or using the arrow keys) pulls the sketch back over the toy or lets the toy through.
 */
export function SketchToToy({ designs, labels }: { designs: SketchDesign[]; labels: Labels }) {
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(50);
  const design = designs[index];

  return (
    <div style={{ "--light": design.light, "--split": split + "%" } as CSSProperties}>
      <div className="comparison-panel stage-light relative isolate aspect-square overflow-hidden rounded-lg border border-line bg-stage-deep select-none">
        {/* The finished toy, standing in its own light. */}
        <div aria-hidden className="stage-light absolute inset-x-0 bottom-0 h-1/2 translate-y-1/3 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,var(--light),transparent_70%)] opacity-20 blur-2xl" />
        <img key={design.image} src={design.image} alt={design.name} draggable={false} className="toy absolute inset-0 size-full animate-rise object-contain p-[7%]" />

        {/* The drawing lies over it, up to the dividing line. */}
        <div className="absolute inset-0 bg-[#f6efdf] [clip-path:inset(0_calc(100%-var(--split))_0_0)]">
          <img key={design.sketch} src={design.sketch} alt="" draggable={false} className="absolute inset-0 size-full object-contain p-[7%] mix-blend-multiply" />
        </div>

        <span className={cn("note absolute top-5 left-5 rounded-full bg-stage/85 px-3 py-1.5 text-ink transition-opacity md:top-7 md:left-7", split < 16 && "opacity-0")}>
          {labels.sketch}
        </span>
        <span className={cn("note absolute top-5 right-5 rounded-full bg-ink px-3 py-1.5 text-stage transition-opacity md:top-7 md:right-7", split > 84 && "opacity-0")}>
          {labels.toy}
        </span>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[var(--split)] w-0">
          <div className="stitch-y absolute inset-y-0 -left-px text-ink/35" />
          <div className="absolute top-1/2 left-0 grid size-12 -translate-1/2 place-items-center rounded-full bg-accent text-white shadow-[0_8px_24px_-6px_rgb(0_0_0/0.16)]">
            <svg viewBox="0 0 20 20" fill="none" className="size-5">
              <path d="m7 5-4 5 4 5M13 5l4 5-4 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* A native range input over the whole picture carries pointer, touch and keyboard control. */}
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-label={labels.drag}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>

      <div role="group" aria-label={labels.pick} className="mt-4 flex gap-3">
        {designs.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "group flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-2 pr-3 text-left ring-1 transition-colors duration-300 ring-inset",
              i === index ? "bg-ink text-stage ring-ink" : "ring-ink/20 hover:ring-ink/60",
            )}
          >
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f6efdf]">
              <img src={item.sketch} alt="" className="size-full object-contain p-1 mix-blend-multiply" />
            </span>
            <span className="min-w-0 max-sm:sr-only">
              <span className="note block opacity-60">{item.code}</span>
              <span className="block truncate text-sm font-semibold">{item.name}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
