import type { BrandConfig } from "@/brand/types";

/**
 * Everything that makes this site one company's site. To set it up for another factory, edit this
 * file and replace the pictures it points to under public/. Nothing else names the company.
 *
 * The company below is made up, as are its contact details, numbers, terms and products.
 */
const brand: BrandConfig = {
  name: { en: "Tuftwell", zh: "绒坊" },
  legalName: { en: "Tuftwell Plush Works Co., Ltd.", zh: "绒坊玩具有限公司" },
  descriptor: { en: "Plush manufacturer", zh: "毛绒玩具工厂" },
  logo: "/brand/logo.svg",

  colors: {
    stage: "#faf7f0",
    stageDeep: "#f0ece2",
    ink: "#343f36",
    inkSoft: "#5a6257",
    accent: "#a34f36",
    warm: "#e9dfcc",
    cool: "#e0e6d9",
  },

  contact: {
    email: "hello@tuftwell.example",
    phone: "+86 000 0000 0000",
    whatsapp: "+86 000 0000 0000",
    wechat: "tuftwell-plush",
    wechatQr: "",
    address: {
      en: "No. 1 Sample Road, Industrial Park, Your City, China",
      zh: "中国某市工业园示例路 1 号",
    },
    hours: { en: "Mon to Sat, 9:00 to 18:00 (UTC+8)", zh: "周一至周六 9:00–18:00（北京时间）" },
  },

  facts: {
    founded: 2009,
    workers: 180,
    monthlyCapacity: 120000,
    moq: 500,
    sampleDays: 7,
    bulkDays: 35,
    certifications: [
      { name: "EN 71", scope: { en: "Toy safety, EU", zh: "欧盟玩具安全" } },
      { name: "ASTM F963", scope: { en: "Toy safety, US", zh: "美国玩具安全" } },
      { name: "CPSIA", scope: { en: "Lead and phthalates, US", zh: "美国铅与邻苯含量" } },
      { name: "ISO 9001", scope: { en: "Quality management", zh: "质量管理体系" } },
    ],
  },

  terms: [
    { label: { en: "Trade terms", zh: "贸易条款" }, value: { en: "EXW, FOB or CIF; DDP to the US, EU and UK on request", zh: "EXW、FOB、CIF；美国、欧盟、英国可做 DDP" } },
    { label: { en: "Port", zh: "出货港口" }, value: { en: "Your Port, China", zh: "中国 某港" } },
    { label: { en: "Payment", zh: "付款方式" }, value: { en: "T/T: 30% deposit, 70% against the bill of lading", zh: "电汇：30% 定金，70% 见提单副本付清" } },
    { label: { en: "Sample fee", zh: "打样费" }, value: { en: "From US$80 a design, refunded on orders of 3,000 pieces", zh: "每款 500 元起，订单满 3000 只退还" } },
    { label: { en: "Packaging", zh: "包装" }, value: { en: "Polybag and export carton as standard; hang tags, gift boxes and display cartons to order", zh: "标准为胶袋加外箱，可定制吊牌、彩盒和展示箱" } },
    { label: { en: "Inspection", zh: "验货" }, value: { en: "Third-party inspection welcome before shipment", zh: "出货前欢迎第三方验货" } },
  ],

  proof: {
    photos: [],
    clients: [],
  },

  caseStudy: {
    title: { en: "One order, from a drawing to the carton", zh: "一张订单，从图稿到装箱" },
    steps: [
      {
        image: "/images/story/brief.webp",
        title: { en: "Day 0: the brief", zh: "第 0 天：需求" },
        note: { en: "A front-view drawing, a target height of 28 cm and a note: no hard parts, for ages 0+.", zh: "一张正面图稿，目标坐高 28 cm，备注：不用硬质配件，适合 0 岁以上。" },
      },
      {
        image: "/images/story/sheet.webp",
        title: { en: "Day 2: design pack", zh: "第 2 天：设计稿" },
        note: { en: "We return the turnaround and a fabric and colour sheet for sign-off before any cutting.", zh: "我们回传三视图和面料色卡，确认后才开始裁剪。" },
      },
      {
        image: "/images/story/sample.webp",
        title: { en: "Day 7: first sample", zh: "第 7 天：首样" },
        note: { en: "A sewn sample ships with photos from every side. One round of changes is included.", zh: "首样寄出，同时附上各个角度的照片，含一轮修改。" },
      },
      {
        image: "/images/story/approved.webp",
        title: { en: "Day 12: sealed sample", zh: "第 12 天：封样" },
        note: { en: "The approved sample is sealed and kept on the line; every piece is checked against it.", zh: "确认样封存并留在产线上，每一只都对照它检验。" },
      },
    ],
  },

  legal: {
    registration: { en: "Business licence no. 0000 0000 0000 0000 00", zh: "统一社会信用代码 0000 0000 0000 0000 00" },
    links: [],
  },

  socials: [],

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
      age: { en: "3+", zh: "3 岁以上" },
      details: [
        { en: "Removable corduroy overalls", zh: "灯芯绒背带裤可脱" },
        { en: "Embroidered leaf pocket", zh: "口袋叶子刺绣" },
        { en: "30 cm seated", zh: "坐高 30 cm" },
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
      age: { en: "3+", zh: "3 岁以上" },
      details: [
        { en: "Tulle dress with foil stars", zh: "烫金星星网纱裙" },
        { en: "Weighted floppy ears", zh: "垂耳加重" },
        { en: "35 cm seated", zh: "坐高 35 cm" },
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
      age: { en: "0+", zh: "0 岁以上" },
      details: [
        { en: "Felt plates sewn into the spine seam", zh: "背鳍车入中缝" },
        { en: "Embroidered face, no hard parts", zh: "五官刺绣，无硬质配件" },
        { en: "28 cm seated", zh: "坐高 28 cm" },
      ],
      views: [
        { image: "/images/products/dino-side.webp", caption: { en: "Side: plates run from crown to tail", zh: "侧面：背鳍从头顶排到尾尖" } },
        { image: "/images/products/dino-back.webp", caption: { en: "Back: closing seam hidden in the pile", zh: "背面：收口缝藏在绒毛里" } },
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
      age: { en: "0+", zh: "0 岁以上" },
      details: [
        { en: "Crinkle paper in the ears", zh: "耳朵内置响纸" },
        { en: "Safe from birth", zh: "新生儿可用" },
        { en: "25 cm seated", zh: "坐高 25 cm" },
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
      age: { en: "3+", zh: "3 岁以上" },
      details: [
        { en: "Knitted jumper, removable", zh: "针织毛衣可脱" },
        { en: "Two-tone brushed tail", zh: "双色梳毛尾巴" },
        { en: "32 cm seated", zh: "坐高 32 cm" },
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
      age: { en: "3+", zh: "3 岁以上" },
      details: [
        { en: "Hooded felt raincoat with toggles", zh: "连帽毛毡雨衣，牛角扣" },
        { en: "Bean-filled base sits upright", zh: "底部填充颗粒，坐得稳" },
        { en: "26 cm tall", zh: "高 26 cm" },
      ],
      onStage: true,
    },
  ],

  turntable: { frames: "/images/turntable", count: 32, product: "dino" },

  shareImage: "/images/share.jpg",
  inquiryEndpoint: process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
};

export default brand;
