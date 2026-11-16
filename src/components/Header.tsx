import { ShoppingBag, SlidersHorizontal, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Header() {
  const {
    viewMode,
    setViewMode,
    cartCount,
    setIsCartOpen,
    settings,
  } = useStore();

  const navLinks = [
    { href: '#products', label: 'المنتجات' },
    { href: '#why-us', label: 'لماذا نحن' },
    { href: '#story', label: 'قصتنا' },
    { href: '#reviews', label: 'آراء العملاء' },
    { href: '#faq', label: 'الأسئلة الشائعة' },
  ];

  return (
    <>
      {/* Non-sticky slim owner toolbar for instant Store / Dashboard switching */}
      <div className="bg-[#1C1610] text-[#FBF9F5] border-b border-[#33291E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-[#D9C7A6] truncate">
            {settings.freeShippingThreshold > 0 ? (
              <span className="tabular-nums">
                شحن مجاني للطلبات فوق {settings.freeShippingThreshold} ر.س
              </span>
            ) : (
              <span>الأسعار والشحن تُدار مباشرة من لوحة تحكم التاجر</span>
            )}
          </div>

          <div
            className="flex items-center gap-1 bg-[#2A2219] p-0.5 rounded-lg mx-auto sm:mx-0"
            role="tablist"
            aria-label="تبديل وضع العرض"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'store'}
              onClick={() => setViewMode('store')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'store'
                  ? 'bg-[#9A6B16] text-white'
                  : 'text-[#D9C7A6] hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>عرض المتجر</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'admin'}
              onClick={() => setViewMode('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-[#9A6B16] text-white'
                  : 'text-[#D9C7A6] hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>لوحة التحكم</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E7DEC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              if (viewMode !== 'store') {
                e.preventDefault();
                setViewMode('store');
              }
            }}
            className="font-display text-xl sm:text-2xl font-bold text-[#1C1610] whitespace-nowrap shrink-0"
          >
            الذهب الطبيعي - المحمودي
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          {viewMode === 'store' ? (
            <nav
              aria-label="التنقل الرئيسي"
              className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#5C4E3C]"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-[#8C5E0B] transition-colors whitespace-nowrap shrink-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center text-sm font-medium text-[#6B5A45] whitespace-nowrap">
              إدارة المنتجات والأسعار المفتوحة وإعدادات الشحن
            </div>
          )}

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            {viewMode === 'store' ? (
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#1C1610] text-[#FBF9F5] hover:bg-[#33291E] transition-colors text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer"
                aria-label="فتح سلة التسوق"
              >
                <ShoppingBag className="w-4 h-4 text-[#DFB86C]" />
                <span>السلة</span>
                <span className="tabular-nums px-1.5 py-0.5 text-xs rounded bg-[#9A6B16] text-white font-semibold">
                  {cartCount}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('store')}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-[#8C5E0B] text-white hover:bg-[#734C08] transition-colors text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>معاينة المتجر</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
