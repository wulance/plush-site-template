"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

interface Props {
  links: { href: string; label: string }[];
  labels: { menu: string; close: string };
  /** What goes under the links: the languages and the call to action. */
  children: ReactNode;
}

/** The section links on screens too narrow for the bar: a button in the header that opens them as a sheet under it. */
export function MobileMenu({ links, labels, children }: Props) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? labels.close : labels.menu}
        onClick={() => setOpen(!open)}
        className="grid size-11 cursor-pointer place-items-center rounded-full ring-1 ring-ink/30 ring-inset"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
          <path d={open ? "m5 5 10 10M15 5 5 15" : "M3 6.5h14M3 13.5h14"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-stage p-3 shadow-[0_24px_40px_-24px_rgb(60_48_31/0.35)]"
      >
        <nav onClick={(event) => (event.target as HTMLElement).closest("a") && setOpen(false)}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="title flex h-14 items-center rounded-md px-4 text-2xl hover:bg-ink/10">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-line px-2 pt-3">{children}</div>
        </nav>
      </div>
    </div>
  );
}
