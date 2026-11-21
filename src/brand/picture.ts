import { asset } from "@/lib/asset";
import sizes from "./images.json";

interface Size {
  width: number;
  height: number;
  smaller: { src: string; width: number }[];
}

/**
 * What an <img> needs for a picture under public/: its address, its size (so the page keeps room for it),
 * and the smaller copies scripts/images.mjs made for small screens and thumbnails. Pictures the script has not seen,
 * such as a full web address, get the address alone.
 */
export function picture(path: string) {
  const size = (sizes as Record<string, Size>)[path];
  if (!size) return { src: asset(path) };
  return {
    src: asset(path),
    width: size.width,
    height: size.height,
    srcSet: size.smaller.length
      ? [...size.smaller, { src: path, width: size.width }].map((copy) => asset(copy.src) + " " + copy.width + "w").join(", ")
      : undefined,
  };
}

export type Pic = ReturnType<typeof picture>;
