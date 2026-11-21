/** Relative luminance of a #rrggbb colour (WCAG). */
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(a: string, b: string, share: number) {
  const channel = (i: number) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - share) + parseInt(b.slice(i, i + 2), 16) * share);
  return "#" + [1, 3, 5].map((i) => channel(i).toString(16).padStart(2, "0")).join("");
}

/**
 * What goes with a brand's accent colour: the text that reads on it (of the colours given, the one that
 * contrasts most; the first wins a tie) and the accent under the pointer, shifted away from that text
 * so a pressed button reads at least as well as a resting one.
 */
export function accentPair(accent: string, texts: string[]) {
  const on = texts.reduce((best, text) => (contrast(accent, text) > contrast(accent, best) ? text : best));
  return { on, hover: mix(accent, luminance(on) < luminance(accent) ? "#ffffff" : "#000000", 0.14) };
}
