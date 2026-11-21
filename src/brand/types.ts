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
  /** The colour of the light this toy stands in. */
  light: string;
  heightCm: number;
  material: Localized;
  /** Two or three short selling points. */
  details: Localized[];
  /** Whether the toy stands in the lineup on the first screen. */
  onStage?: boolean;
}

export interface BrandConfig {
  name: Localized;
  legalName: Localized;
  /** The line under the name in the logo. */
  descriptor: Localized;
  /** A square logo mark under public/. Leave empty to use the first letter of the name. */
  logo: string;
  colors: {
    /** The unlit stage. */
    stage: string;
    /** Panels on the stage. */
    stageDeep: string;
    /** Text and light. */
    ink: string;
    inkSoft: string;
    /** The one brand colour: buttons, emphasis, the turntable panel. */
    accent: string;
    accentDeep: string;
    /** Two supporting colours for lit panels. */
    warm: string;
    cool: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    wechat: string;
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
    certifications: string[];
  };
  categories: { id: string; name: Localized }[];
  products: Product[];
  /** The toy that turns in the 360° section: a folder of frames named 00.webp, 01.webp, ... under public/. */
  turntable: { frames: string; count: number; width: number; height: number };
  /** Where the inquiry form posts JSON. Leave empty and the form opens the visitor's mail app instead. */
  inquiryEndpoint: string;
  /** The address the site is published at, for links in search results. */
  siteUrl: string;
}
