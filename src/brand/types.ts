import type { Localized } from "@/i18n/config";

export interface Product {
  /** Used in links and as the React key; keep it short and unique. */
  id: string;
  /** The item number buyers quote. */
  code: string;
  name: Localized;
  /** One of the ids in `categories`. */
  category: string;
  /** A cut-out of the toy on a transparent background, under public/. */
  image: string;
  /** Optional design drawing with the same framing as `image`; products that have one appear in the sketch-to-toy section. */
  sketch?: string;
  /** The colour this toy is shown against, used as a faint tint behind it. */
  light: string;
  heightCm: number;
  material: Localized;
  /** Two or three short selling points. */
  details: Localized[];
  /** Whether the toy is shown on the sample sheet of the first screen. When no product sets it, all of them do. */
  onStage?: boolean;
  /** Minimum order for this design, in pieces. Without it, `facts.moq` is shown. */
  moq?: number;
  /** Days from the approved sample to shipment. Without it, `facts.bulkDays` is shown. */
  leadDays?: number;
  /** The age the design is tested for, such as "0+" or "3+". */
  age?: Localized;
  /** More pictures for the design's detail view: another side, a close-up of the construction, the toy in a hand. */
  views?: Picture[];
}

/** A photograph under public/ and the line that goes with it. */
export interface Picture {
  image: string;
  caption: Localized;
}

export interface BrandConfig {
  name: Localized;
  legalName: Localized;
  /** The line under the name in the logo. */
  descriptor: Localized;
  /** A square logo mark under public/. Leave empty to use the first letter of the name. */
  logo: string;
  colors: {
    /** The page: paper in a light palette, the unlit floor in a dark one. */
    stage: string;
    /** Panels and cards on the page. */
    stageDeep: string;
    /** Text. `inkSoft` is for secondary text and must still read on `stage`, `stageDeep` and `cool` (4.5:1). */
    ink: string;
    inkSoft: string;
    /** The one brand colour: buttons and emphasis. Text on it turns dark or light by itself. */
    accent: string;
    /** Two tints for bands and panels: the marquee and labels, the turntable and the process panel. */
    warm: string;
    cool: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    wechat: string;
    /** Optional picture of the WeChat QR code, under public/. */
    wechatQr?: string;
    address: Localized;
    hours: Localized;
  };
  facts: {
    founded: number;
    workers: number;
    /** Pieces a month. */
    monthlyCapacity: number;
    /** Minimum order, pieces per design. */
    moq: number;
    sampleDays: number;
    bulkDays: number;
    /** Standards the toys are tested to. With `file` (a report or certificate under public/), the name links to it. */
    certifications: { name: string; scope?: Localized; file?: string }[];
  };
  /** Commercial terms a buyer checks before writing: one row each, in any wording. An empty list hides the table. */
  terms: { label: Localized; value: Localized }[];
  /** Evidence that the factory exists. Empty lists hide their part of the page. */
  proof: {
    /** Photographs of the floor, the sample room, the testing. */
    photos: Picture[];
    /** Names of brands the factory has made toys for, shown only if they allow it. */
    clients: string[];
  };
  /** One order followed from the brief to the approved sample, shown under the sketch-to-toy picture. Leave out to hide it. */
  caseStudy?: { title: Localized; steps: { title: Localized; note: Localized; image: string }[] };
  /** The small print of the footer. */
  legal: {
    /** Company registration or licence number. */
    registration?: Localized;
    /** Privacy policy, terms and the like: an address on this site or elsewhere. */
    links: { label: Localized; href: string }[];
  };
  /** Profiles and shops: Alibaba, LinkedIn, Instagram, Xiaohongshu. */
  socials: { label: string; href: string }[];
  categories: { id: string; name: Localized }[];
  products: Product[];
  /**
   * The toy that turns in the 360° section: a folder of `count` frames of one full turn, named 00.webp, 01.webp, ...
   * under public/, and the id of the product they show. Leave out to drop the section.
   */
  turntable?: { frames: string; count: number; product: string };
  /** Where the inquiry form posts JSON. Leave empty and the form opens the visitor's mail app instead. */
  inquiryEndpoint: string;
  /** The picture shown when the site is shared in a chat or a feed: 1200 × 630, under public/. Empty: none. */
  shareImage: string;
  /** The address the site is published at. Search engines and link previews need it; empty leaves those tags out. */
  siteUrl: string;
}
