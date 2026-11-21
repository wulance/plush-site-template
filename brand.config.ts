import type { BrandConfig } from "@/brand/types";

/**
 * Everything that makes this site one company's site. To set it up for another factory, edit this
 * file and replace the images it points to under public/. Nothing else names the company.
 *
 * "Tuftwell" is a made-up placeholder, as are its contact details, numbers and products.
 */
const brand: BrandConfig = {
  name: { en: "Tuftwell", zh: "绒坊" },
  legalName: { en: "Tuftwell Plush Works Co., Ltd.", zh: "绒坊玩具有限公司" },
  descriptor: { en: "Plush manufacturer", zh: "毛绒玩具工厂" },
  logo: "/brand/logo.svg",

  colors: {
    stage: "#f7f5eb",
    stageDeep: "#eeebe1",
    ink: "#242123",
    inkSoft: "#625d60",
    accent: "#fa6247",
    accentDeep: "#dd482e",
    warm: "#e5f353",
    cool: "#c7b6f4",
  },

  contact: {
    email: "hello@tuftwell.example",
    phone: "+86 000 0000 0000",
    whatsapp: "+86 000 0000 0000",
    wechat: "tuftwell-plush",
    address: {
      en: "No. 1 Sample Road, Industrial Park, Your City, China",
      zh: "中国 某市 工业园 示例路 1 号",
    },
    hours: { en: "Mon to Sat, 9:00 to 18:00 (UTC+8)", zh: "周一至周六 9:00 至 18:00" },
  },

  facts: {
    founded: 2009,
    workers: 180,
    monthlyCapacity: 120000,
    moq: 500,
    sampleDays: 7,
    bulkDays: 35,
    certifications: ["EN 71", "ASTM F963", "CPSIA", "ISO 9001"],
  },

  categories: [
    { id: "classic", name: { en: "Classic animals", zh: "经典动物" } },
    { id: "dressed", name: { en: "Dressed characters", zh: "着装角色" } },
    { id: "baby", name: { en: "Baby & nursery", zh: "婴童安抚" } },
  ],

  products: [
    {
      id: "bear",
      code: "TW-101",
      name: { en: "Overalls Bear", zh: "背带裤小熊" },
      category: "dressed",
      image: "/images/products/bear.webp",
      sketch: "/images/sketches/bear.webp",
      light: "#e9a15b",
      heightCm: 30,
      material: { en: "Short-pile plush, corduroy", zh: "短毛绒、灯芯绒" },
      details: [
        { en: "Removable corduroy overalls", zh: "灯芯绒背带裤可脱" },
        { en: "Embroidered leaf pocket", zh: "口袋叶子刺绣" },
        { en: "30 cm seated", zh: "坐高 30 厘米" },
      ],
      onStage: true,
    },
    {
      id: "rabbit",
      code: "TW-204",
      name: { en: "Starlight Rabbit", zh: "星光长耳兔" },
      category: "dressed",
      image: "/images/products/rabbit.webp",
      sketch: "/images/sketches/rabbit.webp",
      light: "#b9a3f2",
      heightCm: 35,
      material: { en: "Crystal plush, printed tulle", zh: "水晶超柔、印花网纱" },
      details: [
        { en: "Tulle dress with foil stars", zh: "烫金星星网纱裙" },
        { en: "Weighted floppy ears", zh: "垂耳加重" },
        { en: "35 cm seated", zh: "坐高 35 厘米" },
      ],
      onStage: true,
    },
    {
      id: "dino",
      code: "TW-318",
      name: { en: "Sprout Dinosaur", zh: "小芽恐龙" },
      category: "classic",
      image: "/images/products/dino.webp",
      sketch: "/images/sketches/dino.webp",
      light: "#6fd6a4",
      heightCm: 28,
      material: { en: "Stretch plush, felt", zh: "弹力超柔、毛毡" },
      details: [
        { en: "Felt plates sewn into the spine seam", zh: "背鳍车入中缝" },
        { en: "Embroidered face, no hard parts", zh: "五官刺绣 无硬件" },
        { en: "28 cm seated", zh: "坐高 28 厘米" },
      ],
      onStage: true,
    },
    {
      id: "elephant",
      code: "TW-422",
      name: { en: "Cloud Elephant", zh: "云朵小象" },
      category: "baby",
      image: "/images/products/elephant.webp",
      light: "#8fbdf2",
      heightCm: 25,
      material: { en: "Minky plush, printed cotton", zh: "豆豆绒、印花纯棉" },
      details: [
        { en: "Crinkle paper in the ears", zh: "耳朵内置响纸" },
        { en: "Safe from birth", zh: "新生儿可用" },
        { en: "25 cm seated", zh: "坐高 25 厘米" },
      ],
      onStage: true,
    },
    {
      id: "fox",
      code: "TW-507",
      name: { en: "Cable-Knit Fox", zh: "毛衣小狐狸" },
      category: "dressed",
      image: "/images/products/fox.webp",
      light: "#ff8a4c",
      heightCm: 32,
      material: { en: "Long-pile plush, knitted acrylic", zh: "长毛绒、针织腈纶" },
      details: [
        { en: "Knitted jumper, removable", zh: "针织毛衣可脱" },
        { en: "Two-tone brushed tail", zh: "双色梳毛尾巴" },
        { en: "32 cm seated", zh: "坐高 32 厘米" },
      ],
      onStage: true,
    },
    {
      id: "penguin",
      code: "TW-613",
      name: { en: "Raincoat Penguin", zh: "雨衣小企鹅" },
      category: "classic",
      image: "/images/products/penguin.webp",
      light: "#ffd046",
      heightCm: 26,
      material: { en: "Short-pile plush, felt", zh: "短毛绒、毛毡" },
      details: [
        { en: "Hooded felt raincoat with toggles", zh: "连帽毛毡雨衣 牛角扣" },
        { en: "Bean-filled base sits upright", zh: "底部填充颗粒 坐得稳" },
        { en: "26 cm tall", zh: "高 26 厘米" },
      ],
      onStage: true,
    },
  ],

  turntable: { frames: "/images/turntable", count: 32, width: 640, height: 555 },

  inquiryEndpoint: process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export default brand;
