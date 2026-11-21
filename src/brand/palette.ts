import type { CSSProperties } from "react";
import brand from "@brand";
import { accentPair } from "./colour";

// A light palette has dark ink and a dark one has light ink, so one of these reads on any accent.
const accent = accentPair(brand.colors.accent, ["#ffffff", brand.colors.stage, brand.colors.ink]);

/** The brand's colours as CSS variables, set on <html> over the defaults in globals.css. */
export const palette = {
  "--color-stage": brand.colors.stage,
  "--color-stage-deep": brand.colors.stageDeep,
  "--color-ink": brand.colors.ink,
  "--color-ink-soft": brand.colors.inkSoft,
  "--color-accent": brand.colors.accent,
  "--color-on-accent": accent.on,
  "--color-accent-hover": accent.hover,
  "--color-warm": brand.colors.warm,
  "--color-cool": brand.colors.cool,
} as CSSProperties;
