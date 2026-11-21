"""Turn source pictures into the web images the site uses. Needs Pillow and NumPy.

   python3 scripts/pack-images.py product <cutout.png> <id> [sketch.png]
       Trims a transparent cut-out to the toy and writes public/images/products/<id>.webp.
       With a sketch drawn on plain paper in the same framing, crops it the same way to
       public/images/sketches/<id>.webp, so the two line up in the sketch-to-toy section.

   python3 scripts/pack-images.py turntable <folder of 00.png, 01.png, ...>
       Crops every frame of a turn to one shared box and writes public/images/turntable/NN.webp.
       Prints the frame size to put in brand.config.ts.
"""
import glob, os, sys
import numpy as np
from PIL import Image, ImageFilter

PUBLIC = os.path.join(os.path.dirname(__file__), "..", "public", "images")


def box_of(images, margin):
    """The smallest box holding what is visible in every image, with a margin."""
    left, top, right, bottom = 1e9, 1e9, 0, 0
    for image in images:
        ys, xs = np.where(np.array(image)[..., 3] > 12)
        left, top, right, bottom = min(left, xs.min()), min(top, ys.min()), max(right, xs.max() + 1), max(bottom, ys.max() + 1)
    width, height = images[0].size
    return (max(0, int(left) - margin), max(0, int(top) - margin), min(width, int(right) + margin), min(height, int(bottom) + margin))


def fade_shadow(frame):
    """Let the shadow on the ground die out before the edges of the picture, so no edge shows on the page."""
    pixels = np.array(frame)
    height, width = pixels.shape[:2]
    alpha = pixels[..., 3].astype(np.float32)
    toy = np.asarray(Image.fromarray((alpha > 128).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(13))) > 0
    ease = lambda t: np.clip(t, 0, 1) ** 2 * (3 - 2 * np.clip(t, 0, 1))
    x = np.arange(width, dtype=np.float32)
    y = np.arange(height, dtype=np.float32)
    sides = ease(np.minimum(x, width - 1 - x) / (width * 0.24))
    floor = ease((height - 1 - y) / (height * 0.09))
    pixels[..., 3] = np.where(toy, alpha, alpha * sides[None, :] * floor[:, None]).astype(np.uint8)
    return Image.fromarray(pixels)


def save(image, folder, name, longest, quality=86):
    os.makedirs(os.path.join(PUBLIC, folder), exist_ok=True)
    scale = min(1, longest / max(image.size))
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    path = os.path.join(PUBLIC, folder, name + ".webp")
    image.save(path, "WEBP", quality=quality, method=6)
    print(os.path.relpath(path), image.size)


mode = sys.argv[1]
if mode == "product":
    cutout = Image.open(sys.argv[2]).convert("RGBA")
    box = box_of([cutout], 8)
    save(cutout.crop(box), "products", sys.argv[3], 900)
    if len(sys.argv) > 4:
        sketch = Image.open(sys.argv[4]).convert("RGB").resize(cutout.size, Image.LANCZOS)
        # The paper and its grain are lifted to white, so the drawing can be laid on a page of any colour.
        pixels = np.asarray(sketch, dtype=np.float32)
        paper = np.percentile(pixels.reshape(-1, 3), 90, axis=0)
        sketch = Image.fromarray(np.clip(pixels / paper * 255 * 1.07, 0, 255).astype(np.uint8))
        save(sketch.crop(box), "sketches", sys.argv[3], 900, quality=82)
elif mode == "turntable":
    frames = [fade_shadow(Image.open(path).convert("RGBA")) for path in sorted(glob.glob(os.path.join(sys.argv[2], "[0-9][0-9].png")))]
    box = box_of(frames, 6)
    # The toy turns about the middle of the picture, so the box is kept centred on it.
    centre = frames[0].width / 2
    half = max(centre - box[0], box[2] - centre)
    box = (round(centre - half), box[1], round(centre + half), box[3])
    for index, frame in enumerate(frames):
        save(frame.crop(box), "turntable", "%02d" % index, 760, quality=82)
else:
    sys.exit(__doc__)
