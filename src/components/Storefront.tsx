import { useState } from 'react';
import {
  Check,
  ChevronDown,
  Plus,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';
import {
  FAQ_ITEMS,
  STORE_IMAGES,
  TESTIMONIALS,
  WHY_US_ITEMS,
} from '../data/initialStore';
import { useStore } from '../context/StoreContext';
import { FilterCategory } from '../types/store';
import { ResilientImage } from './ResilientImage';

const CATEGORIES: FilterCategory[] = ['الكل', 'سمن', 'عسل', 'بكجات'];

export function Storefront() {
  const {
    products,
    activeCategory,
    setActiveCategory,
    addToCart,
    setIsCartOpen,
    setViewMode,
    settings,
  } = useStore();

  const [addedId, setAddedId] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const filteredProducts =
    activeCategory === 'الكل'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const unpricedCount = products.filter((p) => p.price <= 0).length;

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
    setAddedId(productId);
    setTimeout(() => {
      setAddedId((current) => (current === productId ? null : current));
    }, 1200);
  };

  return (
    <main id="top" className="bg-[#FBF9F5] text-[#1C1610]">
      {/* Hero Section */}
      <section className="border-b border-[#E7DEC9] bg-[#F6F1E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-medium text-[#8C5E0B] mb-3">
                الذهب الطبيعي · سمن بلدي وعسل طبيعي أصيل
              </p>
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1610] leading-[1.2] mb-5"
                style={{ textWrap: 'balance' }}
              >
                نقاء التراث في كل قطرة من السمن والعسل
              </h1>
              <p className="text-base sm:text-lg text-[#5C4E3C] leading-relaxed mb-8 max-w-xl">
                مختارات المحمودي الفاخرة من السمن البلدي الصافي وعسل السدر والزهور
                الطبيعي، مُعدة بعناية فائقة لتليق بمائدتك وهداياك اليومية.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] rounded-lg bg-[#8C5E0B] text-white hover:bg-[#734C08] transition-colors font-semibold text-base whitespace-nowrap shrink-0"
                >
                  <span>تصفح المنتجات</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
                <a
                  href="#story"
                  className="inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-lg border border-[#D4C4A8] text-[#1C1610] hover:bg-[#EDE4D3] transition-colors font-medium text-base whitespace-nowrap shrink-0"
                >
                  اقرأ قصتنا
                </a>
              </div>

              <div className="mt-10 pt-6 border-t border-[#E4D9C4] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-display text-2xl font-bold text-[#1C1610] tabular-nums">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-[#6B5A45] mt-0.5">
                    منتجات طبيعية صافية
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#1C1610]">
                    تغليف فاخر
                  </div>
                  <div className="text-xs sm:text-sm text-[#6B5A45] mt-0.5">
                    عبوات زجاجية محكمة
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#1C1610] tabular-nums">
                    {settings.shippingCost > 0
                      ? `${settings.shippingCost} ر.س`
                      : 'شحن مرن'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#6B5A45] mt-0.5">
                    {settings.freeShippingThreshold > 0
                      ? `مجاني فوق ${settings.freeShippingThreshold} ر.س`
                      : 'توصيل لجميع المدن'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] rounded-xl overflow-hidden border border-[#E2D6BE] bg-[#EFE7D8]">
                <ResilientImage
                  src={STORE_IMAGES.hero}
                  alt="تشكيلة الذهب الطبيعي - المحمودي من السمن البلدي وعسل السدر الفاخر"
                  fallbackTitle="الذهب الطبيعي - المحمودي"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Category Filters & Open Pricing */}
      <section id="products" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs sm:text-sm font-medium text-[#8C5E0B] mb-2">
                تشكيلة المتجر
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1610]">
                منتجاتنا المختارة
              </h2>
            </div>

            {/* Interactive Category Filter Buttons */}
            <div
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1EAE0] rounded-lg border border-[#E6DBC8] w-fit"
              role="group"
              aria-label="تصفية المنتجات حسب التصنيف"
            >
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 min-h-[40px] rounded-md text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#1C1610] text-white'
                        : 'text-[#5C4E3C] hover:text-[#1C1610] hover:bg-[#E8DEC9]/60'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Helpful Store Owner Open-Pricing Banner when prices are unset */}
          {unpricedCount > 0 && (
            <div className="mb-8 px-5 py-4 rounded-xl bg-[#F5EFE3] border border-[#DFCEAF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-[#4A3B28]">
                <span className="font-semibold text-[#1C1610]">
                  تنبيه التسعير المفتوح:
                </span>{' '}
                يوجد <span className="tabular-nums font-bold">{unpricedCount}</span>{' '}
                {unpricedCount === 1 ? 'منتج' : 'منتجات'} بسعر مبدئي غير محدد. يمكنك
                وضع الأسعار وتعديل تكلفة الشحن مباشرة من لوحة التحكم.
              </div>
              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#8C5E0B] text-white hover:bg-[#734C08] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>تحديد الأسعار من لوحة التحكم</span>
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center rounded-xl border border-[#E7DEC9] bg-[#F6F1E7]">
              <p className="text-base text-[#5C4E3C] mb-4">
                لا توجد منتجات في هذا التصنيف حالياً.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('الكل')}
                className="px-5 py-2.5 rounded-lg bg-[#1C1610] text-white text-sm font-medium cursor-pointer"
              >
                عرض جميع المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((product) => {
                const isPriceUnset = product.price <= 0;
                const justAdded = addedId === product.id;

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col bg-white rounded-xl border border-[#E7DEC9] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {/* 4:3 Studio Product Image */}
                    <div className="aspect-[4/3] w-full bg-[#F4EFE6] overflow-hidden border-b border-[#EFE7D8]">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Product Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        {/* Unboxed Metadata with typographic separator */}
                        <div className="flex items-center gap-2 text-xs text-[#7D6B53] mb-1.5">
                          <span>{product.category}</span>
                          {product.weight && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{product.weight}</span>
                            </>
                          )}
                          {!product.inStock && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#B42318] font-medium">
                                نفذت الكمية
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-[#1C1610] mb-1.5 leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#6B5A45] line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Action Footer */}
                      <div className="pt-4 border-t border-[#F0E8DA] flex items-end justify-between gap-4">
                        <div>
                          {isPriceUnset ? (
                            <div>
                              <div className="text-lg font-bold text-[#1C1610] tabular-nums leading-none">
                                ---
                              </div>
                              <button
                                type="button"
                                onClick={() => setViewMode('admin')}
                                className="text-xs font-medium text-[#8C5E0B] hover:underline mt-1.5 block cursor-pointer"
                              >
                                ضع سعرك هنا
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="text-lg font-bold text-[#1C1610] tabular-nums leading-none">
                                {product.price.toLocaleString('en-US')} ر.س
                              </div>
                              <div className="text-xs text-[#7D6B53] mt-1">
                                شامل التغليف
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={!product.inStock}
                            onClick={() => {
                              handleAddToCart(product.id);
                              setIsCartOpen(true);
                            }}
                            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              justAdded
                                ? 'bg-[#1D6F42] text-white'
                                : 'bg-[#1C1610] text-white hover:bg-[#8C5E0B]'
                            }`}
                          >
                            {justAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>تمت الإضافة</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>أضف للسلة</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Us & Our Story Editorial Section */}
      <section
        id="why-us"
        className="py-16 lg:py-24 bg-[#F6F1E7] border-y border-[#E7DEC9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs sm:text-sm font-medium text-[#8C5E0B] mb-2">
                لماذا الذهب الطبيعي - المحمودي
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1610] mb-4">
                معايير جودة لا تقبل المساومة
              </h2>
              <p className="text-base text-[#5C4E3C] leading-relaxed mb-8">
                نعتني بكل مرحلة من المزرعة والمنحل حتى وصول العبوة إليك، لنضمن
                طعاماً أصيلاً يحفظ صحتك ومذاقك الرفيع.
              </p>

              <div id="story" className="pt-8 border-t border-[#DFD3BC]">
                <p className="text-xs sm:text-sm font-medium text-[#8C5E0B] mb-2">
                  قصتنا
                </p>
                <h3 className="font-display text-2xl font-bold text-[#1C1610] mb-3">
                  حكاية المحمودي مع الذهب الطبيعي
                </h3>
                <p className="text-sm sm:text-base text-[#5C4E3C] leading-relaxed">
                  بدأت رحلتنا من شغف العائلة باستخلاص السمن البلدي بالطريقة
                  التقليدية وفرز أجود أنواع العسل الطبيعي من المناحل الموثوقة.
                  سمّينا متجرنا بالذهب الطبيعي لأن النقاء الحقيقي لا يحتاج إلى
                  إضافات، بل إلى أمانة في المصدر وإتقان في التعبئة.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E2D6BE]">
                <ResilientImage
                  src={STORE_IMAGES.story}
                  alt="تحضير العسل الطبيعي والسمن البلدي بالطريقة الحرفية الأصيلة"
                  fallbackTitle="حرفية المحمودي"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2">
                {WHY_US_ITEMS.map((item) => (
                  <div
                    key={item.index}
                    className="pt-4 border-t border-[#DFD3BC]"
                  >
                    <div className="text-xs font-semibold text-[#8C5E0B] tabular-nums mb-1">
                      {item.index}.
                    </div>
                    <h4 className="text-base font-semibold text-[#1C1610] mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-sm text-[#5C4E3C] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section id="reviews" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs sm:text-sm font-medium text-[#8C5E0B] mb-2">
              تجارب عملائنا
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1610]">
              آراء نعتز بها
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {TESTIMONIALS.map((review) => (
              <blockquote
                key={review.id}
                className="p-6 rounded-xl bg-white border border-[#E7DEC9] flex flex-col justify-between gap-6"
              >
                <p className="text-sm sm:text-base text-[#3D3326] leading-relaxed">
                  «{review.quote}»
                </p>
                <footer className="pt-4 border-t border-[#F0E8DA] text-xs text-[#6B5A45]">
                  <div className="text-sm font-semibold text-[#1C1610]">
                    {review.customerName}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span>{review.city}</span>
                    <span aria-hidden="true">·</span>
                    <span>{review.productPurchased}</span>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section
        id="faq"
        className="py-16 lg:py-24 bg-[#F6F1E7] border-t border-[#E7DEC9]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs sm:text-sm font-medium text-[#8C5E0B] mb-2">
              إجابات واضحة
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1610]">
              الأسئلة الشائعة
            </h2>
          </div>

          <div className="divide-y divide-[#DFD3BC] border-y border-[#DFD3BC]">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full py-5 flex items-center justify-between gap-4 text-right cursor-pointer"
                  >
                    <span className="text-base font-semibold text-[#1C1610]">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8C5E0B] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 text-sm sm:text-base text-[#5C4E3C] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1610] text-[#E6DAC5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#33291E]">
            <div>
              <div className="font-display text-2xl font-bold text-white mb-2">
                الذهب الطبيعي - المحمودي
              </div>
              <p className="text-sm text-[#BCAE95] leading-relaxed max-w-sm">
                متخصصون في بيع السمن البلدي الفاخر والعسل الطبيعي الصافي بأعلى
                معايير الجودة والتغليف.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold text-white mb-3">
                روابط المتجر
              </div>
              <ul className="space-y-2 text-sm text-[#BCAE95]">
                <li>
                  <a href="#products" className="hover:text-white transition-colors">
                    المنتجات
                  </a>
                </li>
                <li>
                  <a href="#why-us" className="hover:text-white transition-colors">
                    لماذا نحن
                  </a>
                </li>
                <li>
                  <a href="#story" className="hover:text-white transition-colors">
                    قصتنا
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    الأسئلة الشائعة
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-white mb-3">
                طرق الدفع وإدارة المتجر
              </div>
              <p className="text-sm text-[#BCAE95] mb-4">
                عند الاستلام · Apple Pay · مدى · STC Pay
              </p>
              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2219] border border-[#47392A] text-white hover:bg-[#9A6B16] hover:border-[#9A6B16] transition-colors text-xs font-medium cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>دخول لوحة تحكم صاحب المتجر</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9C8D74]">
            <span>جميع الحقوق محفوظة © الذهب الطبيعي - المحمودي</span>
            <span>العملة المعتمدة: الريال السعودي (ر.س)</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
