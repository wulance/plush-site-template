"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Pic } from "@/brand/picture";
import { cn } from "@/lib/cn";

interface Note {
  side: string;
  title: string;
  body: string;
}

interface Props {
  /** Addresses of the frames of one full turn, in order. */
  frames: string[];
  /** The first frame, shown as a plain picture until the others are drawn. */
  first: Pic;
  alt: string;
  labels: { eyebrow: string; title: string; backdrop: string; caption: string; turn: string; notes: Note[] };
}

/** How far through the scroll each angle is reached: the toy lingers on the sides the notes are about. */
const SCROLL = [0, 0.2, 0.45, 0.7, 1];
const ANGLES = [0, 40, 130, 265, 360];

/** Which note an angle belongs to: front, side, back, and the way round to the front again. */
function noteAt(turns: number, total: number) {
  const angle = (((turns % 1) + 1) % 1) * 360;
  // The scroll ends one full turn round, facing front again: that view is the last note's, until the toy is turned on past it.
  if (angle < 45) return turns >= 1 && turns < 1.125 ? total - 1 : 0;
  return Math.min(total - 1, angle < 135 ? 1 : angle < 270 ? 2 : 3);
}

/**
 * A design shown from every side. The page pins while scrolling turns the toy on the spot, and each
 * side it reaches brings up what was decided there; the toy can also be dragged round, or turned with
 * the arrow keys. For visitors who ask for less motion nothing is pinned or turned for them: the notes
 * are all on the page and the toy turns only in their hand.
 */
export function Turntable({ frames, first, alt, labels: t }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | undefined)[]>([]);
  const drag = useRef<{ x: number; from: number } | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState(0);
  const still = useReducedMotion();
  const total = t.notes.length;
  const count = frames.length;

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.35 });
  const scrolled = useTransform(p, SCROLL, ANGLES.map((angle) => angle / 360));
  /** Turns added by hand, on top of where the scroll has brought the toy. */
  const byHand = useMotionValue(0);
  const turn = useTransform<number, number>([scrolled, byHand], ([a, b]) => (still ? b : a + b));
  const degrees = useTransform(turn, (v) => {
    const angle = Math.round(v * 360);
    return String(angle >= 0 && angle <= 360 ? angle : ((angle % 360) + 360) % 360).padStart(3, "0") + "°";
  });
  const dial = useTransform(turn, [0, 1], [0, 360], { clamp: false });
  const drift = useTransform(p, [0, 1], ["6%", "-6%"]);

  const draw = useCallback(
    (turns: number) => {
      const index = ((Math.round(turns * count) % count) + count) % count;
      setFrame(index);
      setActive(noteAt(turns, total));
      // Until every frame has arrived, the nearest one that has is shown.
      let image: HTMLImageElement | undefined;
      for (let step = 0; step <= count / 2 && !image; step++) {
        image = [images.current[(index + step) % count], images.current[(index - step + count) % count]].find((item) => item?.complete && item.naturalWidth);
      }
      const element = canvas.current;
      const context = element?.getContext("2d");
      if (!element || !context || !image) return;
      if (element.width !== image.naturalWidth) [element.width, element.height] = [image.naturalWidth, image.naturalHeight];
      context.clearRect(0, 0, element.width, element.height);
      context.drawImage(image, 0, 0);
      setDrawn(true);
    },
    [count, total],
  );

  // Frames are fetched once the section shows, a few at a time and coarse to fine: every eighth,
  // then the ones between. The first screen never waits for them, and a slow line still gets a turn.
  useEffect(() => {
    let cancelled = false;
    const order = [8, 4, 2, 1].flatMap((step, pass) => frames.map((_, i) => i).filter((i) => i % step === 0 && (pass === 0 || i % (step * 2) !== 0)));
    const load = (from: number) => {
      if (cancelled || from >= order.length) return;
      const batch = order.slice(from, from + 4);
      let left = batch.length;
      for (const index of batch) {
        const image = new window.Image();
        image.onload = image.onerror = () => {
          draw(turn.get());
          if (--left === 0) load(from + batch.length);
        };
        image.src = frames[index];
        images.current[index] = image;
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        load(0);
      },
      // Only once the section shows: the turn starts a full screen of scrolling later, by which time the coarse passes are in.
      { rootMargin: "0px" },
    );
    if (track.current) observer.observe(track.current);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [draw, turn, frames]);

  useMotionValueEvent(turn, "change", draw);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, from: byHand.get() };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    byHand.set(drag.current.from + (event.clientX - drag.current.x) / event.currentTarget.clientWidth);
  };
  const onPointerEnd = () => {
    drag.current = null;
  };

  const toy = (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      className="relative size-full cursor-grab touch-pan-y rounded-lg select-none active:cursor-grabbing has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent"
    >
      {/* The first frame is a plain picture, so there is a toy before any script runs. */}
      {!drawn && <img {...first} alt="" loading="lazy" draggable={false} className="absolute inset-0 size-full object-contain object-bottom" />}
      <canvas ref={canvas} width={first.width} height={first.height} role="img" aria-label={alt} className="absolute inset-0 size-full object-contain object-bottom" />
      <input
        type="range"
        min={0}
        max={count - 1}
        value={frame}
        aria-label={t.turn}
        aria-valuetext={Math.round((frame / count) * 360) + "°"}
        onChange={(event) => byHand.set(Number(event.target.value) / count - (still ? 0 : scrolled.get()))}
        className="sr-only"
      />
    </div>
  );

  const readout = (
    <div className="note flex items-center gap-3 pt-1">
      <motion.span className="tabular-nums">{degrees}</motion.span>
      <svg viewBox="0 0 32 32" aria-hidden className="size-8">
        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="2 3" />
        <motion.g style={{ rotate: dial, transformOrigin: "16px 16px" }}>
          <circle cx="16" cy="2" r="3" fill="currentColor" />
        </motion.g>
      </svg>
    </div>
  );

  const heading = (
    <div>
      <p className="eyebrow mb-3 [@media(max-height:30rem)]:hidden">{t.eyebrow}</p>
      <h2 className="display text-[clamp(1.75rem,min(4.4vw,6.5svh),4rem)]">{t.title}</h2>
    </div>
  );

  if (still) {
    return (
      <section id="turntable" ref={track} className="px-2 py-10 md:px-3">
        <div className="craft-panel rounded-lg py-10 md:py-14">
          <div className="shell flex items-start justify-between gap-6">
            {heading}
            {readout}
          </div>
          <div className="shell mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="h-[min(60svh,26rem)] lg:col-span-5">{toy}</div>
            <ol className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-7">
              {t.notes.map((note) => (
                <li key={note.title} className="border-t border-line pt-4">
                  <span className="note">{note.side}</span>
                  <h3 className="title mt-2 text-2xl">{note.title}</h3>
                  <p className="mt-2 leading-normal">{note.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="note shell mt-8 text-ink-soft">{t.caption}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="turntable" ref={track} className="relative h-[380svh]">
      <div className="sticky top-0 h-svh p-2 pt-24 md:p-3 md:pt-28">
        <div className="craft-panel relative isolate flex h-full flex-col overflow-hidden rounded-lg">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_65%_at_55%_45%,rgb(255_255_255/0.55),transparent)]" />
          <motion.p
            aria-hidden
            lang="en"
            style={{ x: drift }}
            className="display absolute inset-x-0 top-1/2 -z-10 -translate-y-[58%] text-center text-[min(34vw,62svh)] leading-none whitespace-nowrap text-ink/[0.07]"
          >
            {t.backdrop}
          </motion.p>

          <div className="shell flex items-start justify-between gap-6 pt-7 md:pt-10">
            {heading}
            {readout}
          </div>

          <div className="shell grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3 pb-7 lg:grid-cols-12 lg:grid-rows-1 lg:gap-10 lg:pb-10">
            {/* Every note is on the page for readers who do not scroll; the one for the side in view is the one shown. */}
            <ol className="grid max-lg:order-last lg:col-span-4 lg:content-center">
              {t.notes.map((note, i) => (
                <li
                  key={note.title}
                  className={cn("col-start-1 row-start-1 transition-[opacity,translate] duration-300 ease-soft", i === active ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0")}
                >
                  <span className="note">
                    {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {note.side}
                  </span>
                  <h3 className="title mt-2 text-[clamp(1.5rem,min(3vw,4.6svh),2.75rem)] lg:mt-4">{note.title}</h3>
                  <p className="mt-2 max-w-sm leading-normal lg:mt-4 lg:text-lg">{note.body}</p>
                </li>
              ))}
            </ol>
            <div className="min-h-0 lg:col-span-5">{toy}</div>
            <p className="note self-end text-ink-soft max-lg:hidden lg:col-span-3 lg:text-right">{t.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
