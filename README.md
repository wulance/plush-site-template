# plush-site-template

A marketing and catalogue site for a plush toy factory, in English and Chinese, where one file says whose
factory it is. The company it ships with is made up, as are its contact details, numbers, terms and
products. All pictures are original: the product and sketch images are generated, and the turning toy is
modelled and rendered by a script in this repository.

## What is on the page

1. **Studio**: an editorial introduction and a pattern-paper sample sheet the visitor steps through.
2. **Turntable**: one toy that turns through 360° as the page scrolls or as it is dragged, with a note for each side.
3. **Sketch to toy**: a divider dragged across a design drawing and the finished toy, and one order followed from brief to shipment.
4. **Range**: product cards with a category filter; a card opens the design's sheet and its other pictures.
5. **Process**: the steps of an order, the factory's figures, its test standards and its trade terms.
6. **Proof**: factory photos and client names, shown once there are some.
7. **Inquiry**: a form and the contact details.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/, for any static host
npm run preview    # serve out/ locally
```

## Make it another company's site

Work down this list; nothing else names the company.

1. **Edit [`brand.config.ts`](brand.config.ts).** It holds everything specific to one company:

   | In `brand.config.ts` | What it changes |
   | --- | --- |
   | `name`, `legalName`, `descriptor` | Company name in the header, footer, page title and copy (English and Chinese) |
   | `logo` | The mark in the header and the browser tab |
   | `colors` | Page, text, accent and tint colours of the whole site. Text on the accent colour turns dark or light by itself to stay readable |
   | `contact` | Email, phone, WhatsApp, WeChat ID and QR code, address and hours |
   | `facts` | Founding year, head count, capacity, minimum order, lead times, test standards (each with an optional report file) |
   | `terms` | Trade terms, port, payment, sample fee, packaging, inspection: any rows, in any order |
   | `proof` | Factory photos and client names. Empty lists hide the section |
   | `caseStudy` | One order told in pictures, under the sketch-to-toy slider. Leave it out to hide it |
   | `legal`, `socials` | Registration line, policy links and social links in the footer |
   | `categories`, `products` | The samples on the first screen, the range and its filter, the sketch-to-toy designs. A product can carry its own `moq`, `leadDays`, `age` and extra `views` |
   | `turntable` | The folder of turning frames, how many there are, and which product they show. Leave it out to hide the section |
   | `shareImage` | The 1200 × 630 picture shown when the site is linked in a chat or on social media |

   Product codes (`TW-101` …) are written out per product; change the prefix there.

2. **Replace the files the config points to.**

   | File | What it is |
   | --- | --- |
   | `public/brand/logo.svg` | The logo mark |
   | `public/images/share.jpg` | The share picture |
   | `public/images/products/*.webp` | One cut-out per product, plus any extra views |
   | `public/images/sketches/*.webp` | The design drawing of a product, in the same framing as its cut-out |
   | `public/images/turntable/NN.webp` | The frames of the turning toy |
   | `public/images/story/*`, `public/images/factory/*` | Case-study and factory pictures |

   - **Products**: start from a cut-out of the toy on a transparent background.
     `python3 scripts/pack-images.py product cutout.png <id> [sketch.png]` trims it and writes
     `public/images/products/<id>.webp`, and with a drawing in the same framing also
     `public/images/sketches/<id>.webp`. The product appears in the sketch-to-toy section when its `sketch` is set.
   - **Turntable**: pictures of one toy turned in equal steps through a full circle, as `00.png`, `01.png` …
     on a transparent background, from a photo turntable or a 3D model. 32 frames (11.25° apart) turn smoothly;
     800 px square is enough. `python3 scripts/pack-images.py turntable <folder>` crops them to one shared box
     and writes them to `public/images/turntable/`; put the number of frames in `turntable.count`. The frame
     size is read from the files. The frames here come from
     `blender -b -P scripts/render-turntable.py -- <out.png> <degrees>`.

3. **Delete the pictures you no longer use.** `npm run build` stops and lists every picture under
   `public/images` that `brand.config.ts` does not name, so the previous company's pictures cannot be
   published by accident. It also stops if the config names a picture that is not there.

4. **Read the wording once.** The headlines, turntable notes, process steps and form labels are in
   [`src/i18n/dictionaries.ts`](src/i18n/dictionaries.ts). They name no company, but they make claims
   (hand-closed seams, sample in a week) that should be true of the factory.

5. **Set the public address** (`NEXT_PUBLIC_SITE_URL`) where the site is built. Without it the site leaves
   out the tags that need a full address: the canonical link, the language alternates and the share picture.

## Settings

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The public address, such as `https://www.example.com`. Needed for link previews and search engines; see step 5 |
| `NEXT_PUBLIC_INQUIRY_ENDPOINT` | Where the inquiry form posts JSON. Left empty, the form asks the visitor's mail app to open with the inquiry filled in, and shows the text to copy in case no mail app answers |
| `NEXT_PUBLIC_BASE_PATH` | Set when the site is served from a sub-folder |
