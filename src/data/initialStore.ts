import { FaqItem, Product, StoreSettings, Testimonial } from '../types/store';

export const STORE_IMAGES = {
  hero: '/src/assets/images/hero_ghee_honey_1794839698724.jpg',
  ghee: '/src/assets/images/product_ghee_jar_1794839699363.jpg',
  sidrHoney: '/src/assets/images/product_sidr_honey_1794839700471.jpg',
  flowerHoney: '/src/assets/images/product_flower_honey_1794839700461.jpg',
  giftBox: '/src/assets/images/product_gift_box_1794839700997.jpg',
  story: '/src/assets/images/story_craftsmanship_1794839701079.jpg',
} as const;

export const PRESET_PRODUCT_IMAGES: { label: string; url: string }[] = [
  { label: 'سمن بلدي فاخر', url: STORE_IMAGES.ghee },
  { label: 'عسل سدر طبيعي', url: STORE_IMAGES.sidrHoney },
  { label: 'عسل زهور صافي', url: STORE_IMAGES.flowerHoney },
  { label: 'بوكس الهدايا الفاخر', url: STORE_IMAGES.giftBox },
  { label: 'تشكيلة السمن والعسل', url: STORE_IMAGES.hero },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ghee-500',
    name: 'سمن بلدي فاخر 500غ',
    category: 'سمن',
    price: 0,
    weight: '500 غرام',
    description: 'سمن بلدي صافي محضّر على نار هادئة بنكهة تراثية غنية وقوام ذهبي ناعم.',
    image: STORE_IMAGES.ghee,
    inStock: true,
  },
  {
    id: 'ghee-1000',
    name: 'سمن بلدي فاخر 1 كغ',
    category: 'سمن',
    price: 0,
    weight: '1 كيلوغرام',
    description: 'العبوة العائلية من السمن البلدي الطبيعي الخالي من أي إضافات أو مواد حافظة.',
    image: STORE_IMAGES.ghee,
    inStock: true,
  },
  {
    id: 'sidr-500',
    name: 'عسل سدر فاخر 500غ',
    category: 'عسل',
    price: 0,
    weight: '500 غرام',
    description: 'عسل سدر نقي بقوام كثيف ورائحة عطرية أصيلة، مفحوص ومضمون الجودة.',
    image: STORE_IMAGES.sidrHoney,
    inStock: true,
  },
  {
    id: 'sidr-1000',
    name: 'عسل سدر فاخر 1 كغ',
    category: 'عسل',
    price: 0,
    weight: '1 كيلوغرام',
    description: 'كيلو كامل من عسل السدر الطبيعي النقي من قطفات مختارة بعناية فائقة.',
    image: STORE_IMAGES.sidrHoney,
    inStock: true,
  },
  {
    id: 'flower-500',
    name: 'عسل زهور طبيعي 500غ',
    category: 'عسل',
    price: 0,
    weight: '500 غرام',
    description: 'عسل زهور بري خفيف ومغذي بمذاق متوازن يناسب الاستخدام اليومي والتحلية الصحية.',
    image: STORE_IMAGES.flowerHoney,
    inStock: true,
  },
  {
    id: 'gift-box',
    name: 'بوكس الهدايا الفاخر (سمن + عسل)',
    category: 'بكجات',
    price: 0,
    weight: 'طقم هدايا متكامل',
    description: 'تشكيلة إهداء راقية تجمع بين السمن البلدي وعسل السدر في عبوة فاخرة.',
    image: STORE_IMAGES.giftBox,
    inStock: true,
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  shippingCost: 0,
  freeShippingThreshold: 0,
  whatsappNumber: '966500000000',
};

export const WHY_US_ITEMS = [
  {
    index: '01',
    title: 'نقاء طبيعي بدون إضافات',
    description: 'نلتزم بتقديم سمن بلدي وعسل طبيعي خام بنسبة 100% دون أي زيوت مهدرجة أو سكريات مضافة.',
  },
  {
    index: '02',
    title: 'تحضير وفرز على البارد والهادئ',
    description: 'يُصفى العسل على البارد ويُطبخ السمن ببطء للحفاظ على القيمة الغذائية والطعم الأصيل.',
  },
  {
    index: '03',
    title: 'تغليف زجاجي يحفظ الجودة',
    description: 'نستخدم عبوات زجاجية محكمة الإغلاق تحمي النكهة والرائحة طوال فترة الشحن والتخزين.',
  },
  {
    index: '04',
    title: 'شحن سريع لجميع مدن المملكة',
    description: 'تجهيز فوري للطلبات وتوصيل مبرد وآمن إلى باب منزلك مع متابعة مباشرة عبر الواتساب.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    customerName: 'عبدالرحمن الشهري',
    city: 'الرياض',
    productPurchased: 'سمن بلدي فاخر 1 كغ',
    quote: 'رائحة السمن وطعمه أعادت لنا مذاق السمن البيتي الأصيل، والتغليف وصل محكماً ونظيفاً جداً.',
  },
  {
    id: 't2',
    customerName: 'نورة القحطاني',
    city: 'جدة',
    productPurchased: 'عسل سدر فاخر 500غ',
    quote: 'قوام عسل السدر ثقيل ونكهته مميزة من أول ملعقة، أصبح خيارنا الدائم للفطور وللضيافة.',
  },
  {
    id: 't3',
    customerName: 'فهد الدوسري',
    city: 'الدمام',
    productPurchased: 'بوكس الهدايا الفاخر',
    quote: 'طلبت بوكس الهدايا للوالدة وكان تنسيق الصندوق فاخراً ومشرفاً بحق، والتواصل كان سريعاً.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'f1',
    question: 'هل العسل والسمن طبيعي 100%؟',
    answer: 'نعم، جميع منتجات الذهب الطبيعي - المحمودي طبيعية وخالية تماماً من السكر المضاف أو الزيوت النباتية أو المواد الحافظة.',
  },
  {
    id: 'f2',
    question: 'كيف يتم احتساب الأسعار وتكلفة الشحن؟',
    answer: 'تُحدَّث الأسعار وتكلفة الشحن وحد الشحن المجاني مباشرة من قبل إدارة المتجر وتظهر لك بشكل فوري في صفحة المنتج وسلة التسوق.',
  },
  {
    id: 'f3',
    question: 'ما هي طرق الدفع المتاحة عند الطلب؟',
    answer: 'نوفر الدفع عند الاستلام، بالإضافة إلى الدفع الإلكتروني عبر Apple Pay ومدى وSTC Pay.',
  },
  {
    id: 'f4',
    question: 'كيف تصلني فاتورة وتأكيد الطلب؟',
    answer: 'بمجرد إرسال الطلب عبر زر الواتساب، تصلنا جميع تفاصيل سلتك وعنوانك فوراً ليتم تأكيد الطلب وموعد التوصيل معك مباشرة.',
  },
];
