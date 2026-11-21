// Run before `dev`, `build` and `typecheck`. For every picture under public/images it writes half- and
// quarter-width copies for small screens and thumbnails (public/images/_small) and records the sizes in
// src/brand/images.json, so pages can offer them all and reserve the right space. It also compares the
// pictures with brand.config.ts: one the config names but the folder lacks stops the run, and so does one
// the folder holds but the config never names (with --strict, as the build passes), since that is how a
// previous company's pictures get published.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const small = join(pub, "images", "_small");
const config = readFileSync(join(root, "brand.config.ts"), "utf8");
const strict = process.argv.includes("--strict");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return path === small ? [] : walk(path);
    return /\.(webp|png|jpe?g|avif)$/i.test(entry.name) ? [path] : [];
  });
}

const named = [...config.matchAll(/["'`](\/[^"'`\s]+)["'`]/g)].map((match) => match[1]);
const files = walk(join(pub, "images"));
const web = (path) => "/" + relative(pub, path).split("\\").join("/");

const missing = named.filter((path) => /\.\w+$/.test(path) && !existsSync(join(pub, path)));
const unused = files.map(web).filter((path) => !named.some((name) => name === path || path.startsWith(name + "/")));

const sizes = {};
const kept = new Set();
for (const file of files) {
  const { width, height } = await sharp(file).metadata();
  const entry = (sizes[web(file)] = { width, height, smaller: [] });
  // Half and quarter widths, down to what a thumbnail needs.
  for (const share of [2, 4]) {
    const smallWidth = Math.round(width / share);
    if (width <= 480 || smallWidth < 160) continue;
    const target = join(small, relative(join(pub, "images"), file)).replace(/\.\w+$/, "-" + smallWidth + ".webp");
    kept.add(target);
    entry.smaller.push({ src: web(target), width: smallWidth });
    if (existsSync(target) && statSync(target).mtimeMs >= statSync(file).mtimeMs) continue;
    mkdirSync(dirname(target), { recursive: true });
    await sharp(file).resize({ width: smallWidth }).webp({ quality: 80 }).toFile(target);
  }
}
if (existsSync(small)) for (const file of walk(small).filter((file) => !kept.has(file))) rmSync(file);
writeFileSync(join(root, "src", "brand", "images.json"), JSON.stringify(sizes, null, 1) + "\n");

const list = (paths) => paths.map((path) => "  public" + path).join("\n");
if (missing.length) console.error("\nbrand.config.ts names pictures that are not there:\n" + list(missing));
if (unused.length) {
  const folders = [...new Set(unused.map((path) => dirname(path)))];
  console.error(
    "\nPictures under public/images that brand.config.ts never names (" + unused.length + " in " + folders.join(", ") + "):\n" +
      list(unused.slice(0, 12)) + (unused.length > 12 ? "\n  ..." : "") +
      "\nThey would be published with the site. Delete them, or name them in brand.config.ts.",
  );
}
if (missing.length || (strict && unused.length)) process.exit(1);
