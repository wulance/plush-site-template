"use client";

import { useState } from "react";

/** Copies a short text, such as a WeChat ID that cannot be a link, and says so. */
export function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true), () => setCopied(false))}
      className="inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ring-1 ring-ink/30 ring-inset hover:ring-ink/60"
    >
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}
