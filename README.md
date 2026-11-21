# plush-site-template

A marketing and catalogue site for a plush toy factory, in English and Chinese, where one file says whose
factory it is. The company shown, "Tuftwell / 绒坊", is made up, as are its contact details, numbers and
products. All pictures are original: the product and sketch images are generated, and the turning dinosaur
is modelled and rendered by a script in this repository.

## What is on the page

1. **Studio**: an editorial introduction and a pattern-paper sample sheet that steps through the range.
2. **Turntable**: a toy that turns through 360° as the page scrolls, with a note for each side.
3. **Sketch to toy**: a divider dragged across a design drawing and the finished toy.
4. **Range**: product cards with a category filter.
5. **Process**: the steps of an order and the factory's figures.
6. **Inquiry**: a form and the contact details.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/, for any static host
npm run preview    # serve out/ locally
```

## Make it another company's site

Edit [`brand.config.ts`](brand.config.ts). It holds everything specific to one company:

| In `brand.config.ts` | What it changes |
| --- | --- |
| `name`, `legalName`, `descriptor` | Company name in the header, footer, page title and copy (English and Chinese) |
| `logo` | The mark in the header and the browser tab; a file under `public/` |
| `colors` | Stage, text and accent colours of the whole site |
| `contact` | Email, phone, WhatsApp, WeChat, address and hours |
| `facts` | Founding year, head count, capacity, minimum order, lead times, certifications |
| `categories`, `products` | The line-up on the stage, the range and its filter, the sketch-to-toy designs |
| `turntable` | Where the turning frames are and how many there are |

Then replace the pictures it points to:

- **Products**: a cut-out of each toy on a transparent background.
  `python3 scripts/pack-images.py product cutout.png <id> [sketch.png]` trims it and writes
  `public/images/products/<id>.webp`. Given a drawing in the same framing, it also writes
  `public/images/sketches/<id>.webp`, and the product appears in the sketch-to-toy section when its
  `sketch` is set.
- **Turntable**: 32 pictures of one toy, turned 11.25° each, as `00.png` … `31.png` on a transparent
  background, from a photo turntable or a 3D model. `python3 scripts/pack-images.py turntable <folder>`
  writes them to `public/images/turntable/`. The frames here come from
  `blender -b -P scripts/render-turntable.py -- <out.png> <degrees>`.

The wording of the sections (headlines, process steps, form labels) is in
[`src/i18n/dictionaries.ts`](src/i18n/dictionaries.ts); it names no company.

## Settings

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The public address, for link previews |
| `NEXT_PUBLIC_INQUIRY_ENDPOINT` | Where the inquiry form posts JSON. Left empty, the form opens the visitor's mail app with the inquiry filled in |
| `NEXT_PUBLIC_BASE_PATH` | Set when the site is served from a sub-folder |
