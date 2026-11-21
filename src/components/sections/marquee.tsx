"use client";

import { useState } from "react";

/** What the factory makes, running across the page on a tinted band. It stops under the pointer and has a button to stop it for good. */
export function Marquee({ items, labels }: { items: string[]; labels: { pause: string; play: string } }) {
  const [paused, setPaused] = useState(false);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="display flex items-center gap-8 pr-8 text-xl md:gap-12 md:pr-12 md:text-2xl">
          {item}
          <span aria-hidden className="size-1.5 rounded-full bg-accent/60" />
        </li>
      ))}
    </ul>
  );
  return (
    <section className="lit relative overflow-hidden border-y border-line bg-warm/35 py-5 md:py-6">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={paused ? { animationPlayState: "paused" } : undefined}>
        {row(false)}
        {row(true)}
      </div>
      <button
        type="button"
        aria-pressed={paused}
        aria-label={paused ? labels.play : labels.pause}
        onClick={() => setPaused(!paused)}
        className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-stage text-ink ring-1 ring-ink/30 ring-inset hover:ring-ink/60 motion-reduce:hidden"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 fill-current">
          {paused ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" />}
        </svg>
      </button>
    </section>
  );
}
