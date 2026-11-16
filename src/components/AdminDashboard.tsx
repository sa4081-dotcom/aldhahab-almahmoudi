import React, { useMemo, useState } from 'react';
import {
  Check,
  Edit3,
  Plus,
  RotateCcw,
  Search,
  Store,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { PRESET_PRODUCT_IMAGES, STORE_IMAGES } from '../data/initialStore';
import { useStore } from '../context/StoreContext';
import { FilterCategory, Product, ProductCategory } from '../types/store';
import { ResilientImage } from './ResilientImage';

const PRODUCT_CATEGORIES: ProductCategory[] = ['سمن', 'عسل', 'بكجات'];
const FILTER_OPTIONS: FilterCategory[] = ['الكل', 'سمن', 'عسل', 'بكجات'];

interface ProductFormState {
  name: string;
  category: ProductCategory;
  price: string;
  weight: string;
  description: string;
  image: string;
  inStock: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  category: 'سمن',
  price: '0',
  weight: '',
  description: '',
  image: STORE_IMAGES.ghee,
  inStock: true,
};

export function AdminDashboard() {
  const {
    products,
    settings,
    updateProductPrice,
    updateProduct,
    addProduct,
    deleteProduct,
    updateSettings,
    resetAllPricesToZero,
    resetStoreToDefaults,
    setViewMode,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState<FilterCategory>('الكل');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [formState, setFormState] = useState<ProductFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResetMode, setConfirmResetMode] = useState<'prices' | 'all' | null>(null);
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = filterCat === 'الكل' || p.category === filterCat;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.weight.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, filterCat, searchQuery]);

  const unpricedCount = products.filter((p) => p.price <= 0).length;

  const triggerSavedNotice = (id: string) => {
    setSavedNoticeId(id);
    setTimeout(() => {
      setSavedNoticeId((cur) => (cur === id ? null : cur));
    }, 1200);
  };

  const openAddForm = () => {
    setEditingProductId(null);
    setFormState(EMPTY_FORM);
    setFormError(null);
    setIsAddFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setIsAddFormOpen(false);
    setEditingProductId(product.id);
    setFormState({
      name: product.name,
      category: product.category,
      price: String(product.price),
      weight: product.weight,
      description: product.description,
      image: product.image,
      inStock: product.inStock,
    });
    setFormError(null);
  };

  const closeFormModal = () => {
    setIsAddFormOpen(false);
    setEditingProductId(null);
    setFormError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormState((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setFormError('يرجى إدخال اسم المنتج');
      return;
    }

    const parsedPrice = Number(formState.price);
    const safePrice =
      Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formState.name.trim(),
        category: formState.category,
        price: safePrice,
        weight: formState.weight.trim() || 'عبوة قياسية',
        description:
          formState.description.trim() || 'منتج طبيعي فاخر من مختارات المحمودي.',
        image: formState.image.trim() || STORE_IMAGES.ghee,
        inStock: formState.inStock,
      });
      triggerSavedNotice(editingProductId);
    } else {
      addProduct({
        name: formState.name.trim(),
        category: formState.category,
        price: safePrice,
        weight: formState.weight.trim() || 'عبوة قياسية',
        description:
          formState.description.trim() || 'منتج طبيعي فاخر من مختارات المحمودي.',
        image: formState.image.trim() || STORE_IMAGES.ghee,
        inStock: formState.inStock,
      });
    }

    closeFormModal();
  };

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[#F7F3EA] text-[#1C1610] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E3D8C3]">
          <div>
            <p className="text-xs font-medium text-[#8C5E0B] mb-1">
              لوحة تحكم صاحب المتجر
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1610]">
              إدارة الأسعار والمنتجات والشحن
            </h1>
            <p className="text-sm text-[#5C4E3C] mt-1">
              أي تعديل على الأسعار أو الشحن ينعكس مباشرة في واجهة المتجر وسلة التسوق.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#8C5E0B] text-white hover:bg-[#734C08] transition-colors text-sm font-semibold whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('store')}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#1C1610] text-white hover:bg-[#33291E] transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#DFB86C]" />
              <span>عرض المتجر</span>
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#E6DBC8]">
            <div className="text-xs text-[#6B5A45]">إجمالي المنتجات</div>
            <div className="text-2xl font-bold text-[#1C1610] tabular-nums mt-1">
              {products.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E6DBC8]">
            <div className="text-xs text-[#6B5A45]">منتجات بدون سعر (---)</div>
            <div className="text-2xl font-bold text-[#8C5E0B] tabular-nums mt-1">
              {unpricedCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E6DBC8]">
            <div className="text-xs text-[#6B5A45]">سعر الشحن الحالي</div>
            <div className="text-2xl font-bold text-[#1C1610] tabular-nums mt-1">
              {settings.shippingCost.toLocaleString('en-US')} ر.س
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E6DBC8]">
            <div className="text-xs text-[#6B5A45]">حد الشحن المجاني</div>
            <div className="text-2xl font-bold text-[#1C1610] tabular-nums mt-1">
              {settings.freeShippingThreshold > 0
                ? `${settings.freeShippingThreshold.toLocaleString('en-US')} ر.س`
                : '0 (غير مفعل)'}
            </div>
          </div>
        </div>

        {/* Shipping & Store Settings Panel */}
        <section className="p-6 rounded-xl bg-white border border-[#E6DBC8]">
          <h2 className="text-lg font-bold text-[#1C1610] mb-1">
            إعدادات الشحن والتواصل المفتوحة
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A45] mb-5">
            حدد سعر الشحن وحد الشحن المجاني ورقم الواتساب الخاص باستلام الطلبات.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="admin-shipping-cost"
                className="block text-xs font-semibold text-[#4A3B28] mb-1.5"
              >
                سعر الشحن (ريال سعودي)
              </label>
              <input
                id="admin-shipping-cost"
                type="number"
                min={0}
                step="any"
                value={settings.shippingCost}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  updateSettings({ shippingCost: val });
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm font-semibold text-[#1C1610] tabular-nums focus:outline-none focus:border-[#8C5E0B]"
              />
              <span className="text-xs text-[#7D6B53] mt-1 block">
                الافتراضي 0 — يظهر مباشرة في سلة العميل.
              </span>
            </div>

            <div>
              <label
                htmlFor="admin-free-threshold"
                className="block text-xs font-semibold text-[#4A3B28] mb-1.5"
              >
                حد الشحن المجاني (ر.س)
              </label>
              <input
                id="admin-free-threshold"
                type="number"
                min={0}
                step="any"
                value={settings.freeShippingThreshold}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  updateSettings({ freeShippingThreshold: val });
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm font-semibold text-[#1C1610] tabular-nums focus:outline-none focus:border-[#8C5E0B]"
              />
              <span className="text-xs text-[#7D6B53] mt-1 block">
                اجعله 0 لتعطيل الشرط، أو أدخل المبلغ ليصبح الشحن مجانياً فوقه.
              </span>
            </div>

            <div>
              <label
                htmlFor="admin-whatsapp"
                className="block text-xs font-semibold text-[#4A3B28] mb-1.5"
              >
                رقم واتساب استلام الطلبات (بصيغة دولية)
              </label>
              <input
                id="admin-whatsapp"
                type="tel"
                dir="ltr"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  updateSettings({ whatsappNumber: e.target.value })
                }
                placeholder="9665XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm font-semibold text-[#1C1610] text-right tabular-nums focus:outline-none focus:border-[#8C5E0B]"
              />
              <span className="text-xs text-[#7D6B53] mt-1 block">
                مثال: 966501234567 (بدون علامة +).
              </span>
            </div>
          </div>
        </section>

        {/* Add / Edit Product Inline Modal Panel */}
        {(isAddFormOpen || editingProductId !== null) && (
          <section className="p-6 rounded-xl bg-white border-2 border-[#8C5E0B]">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-lg font-bold text-[#1C1610]">
                {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
              </h2>
              <button
                type="button"
                onClick={closeFormModal}
                className="p-2 rounded-lg text-[#5C4E3C] hover:bg-[#F1EAE0] cursor-pointer"
                aria-label="إغلاق النموذج"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A3B28] mb-1.5">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="مثال: سمن غنم بلدي 750غ"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3B28] mb-1.5">
                    التصنيف
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3B28] mb-1.5">
                    السعر (ر.س) — 0 يظهر كـ ---
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={formState.price}
                    onChange={(e) =>
                      setFormState({ ...formState, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm font-semibold text-[#1C1610] tabular-nums focus:outline-none focus:border-[#8C5E0B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3B28] mb-1.5">
                    الوزن / العبوة
                  </label>
                  <input
                    type="text"
                    value={formState.weight}
                    onChange={(e) =>
                      setFormState({ ...formState, weight: e.target.value })
                    }
                    placeholder="مثال: 500 غرام"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#4A3B28] mb-1.5">
                    الوصف المختصر
                  </label>
                  <input
                    type="text"
                    value={formState.description}
                    onChange={(e) =>
                      setFormState({ ...formState, description: e.target.value })
                    }
                    placeholder="وصف موجز للمنتج وجودته"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  />
                </div>
              </div>

              {/* Product Image Selection */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-[#4A3B28]">
                  صورة المنتج (اختر صورة جاهزة أو ارفع صورة من جهازك)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_PRODUCT_IMAGES.map((preset) => {
                    const selected = formState.image === preset.url;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setFormState({ ...formState, image: preset.url })
                        }
                        className={`flex items-center gap-2 p-1.5 pr-2 pl-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#8C5E0B] bg-[#F5EFE3] font-semibold text-[#1C1610]'
                            : 'border-[#E2D6BE] bg-white text-[#5C4E3C] hover:border-[#CBB894]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}

                  <label className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] hover:bg-[#EFE7D8] text-xs font-medium text-[#1C1610] cursor-pointer">
                    <Upload className="w-4 h-4 text-[#8C5E0B]" />
                    <span>رفع صورة من الجهاز</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="product-instock"
                  type="checkbox"
                  checked={formState.inStock}
                  onChange={(e) =>
                    setFormState({ ...formState, inStock: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#8C5E0B] cursor-pointer"
                />
                <label
                  htmlFor="product-instock"
                  className="text-sm text-[#1C1610] cursor-pointer"
                >
                  المنتج متوفر حالياً للشراء
                </label>
              </div>

              {formError && (
                <p className="text-xs font-medium text-[#B42318]">{formError}</p>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 min-h-[42px] rounded-lg bg-[#1C1610] text-white hover:bg-[#8C5E0B] transition-colors text-sm font-semibold cursor-pointer"
                >
                  {editingProductId ? 'حفظ التعديلات' : 'إضافة المنتج للمتجر'}
                </button>
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-5 py-2.5 min-h-[42px] rounded-lg border border-[#D4C4A8] text-sm font-medium text-[#5C4E3C] hover:bg-[#F1EAE0] cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Products & Direct Open Pricing Table */}
        <section className="rounded-xl bg-white border border-[#E6DBC8] overflow-hidden">
          <div className="p-5 border-b border-[#EFE7D8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#1C1610]">
                جدول المنتجات والأسعار المباشرة
              </h2>
              <p className="text-xs text-[#6B5A45] mt-0.5">
                غيّر السعر في خانة «السعر» ليظهر في المتجر فوراً. القيمة 0 تعرض «---» و«ضع سعرك هنا».
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#7D6B53] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث عن منتج..."
                  className="w-full sm:w-56 pr-9 pl-3 py-2 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#F4EFE6] rounded-lg border border-[#E6DBC8] overflow-x-auto">
                {FILTER_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCat(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      filterCat === cat
                        ? 'bg-[#1C1610] text-white'
                        : 'text-[#5C4E3C] hover:text-[#1C1610]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#6B5A45]">
              لا توجد منتجات مطابقة للبحث أو التصنيف المحدد.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EE] border-b border-[#E6DBC8] text-xs font-semibold text-[#5C4E3C]">
                    <th className="py-3.5 px-4">المنتج</th>
                    <th className="py-3.5 px-4">التصنيف</th>
                    <th className="py-3.5 px-4">السعر (ر.س)</th>
                    <th className="py-3.5 px-4">المعاينة في المتجر</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DA] text-sm">
                  {filteredProducts.map((product) => {
                    const isUnset = product.price <= 0;
                    const justSaved = savedNoticeId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-[#FCF9F3] transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-[220px]">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E7DEC9] bg-[#F4EFE6] shrink-0">
                              <ResilientImage
                                src={product.image}
                                alt={product.name}
                                fallbackTitle={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-[#1C1610]">
                                {product.name}
                              </div>
                              <div className="text-xs text-[#7D6B53]">
                                {product.weight}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium text-[#5C4E3C]">
                          {product.category}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              step="any"
                              aria-label={`سعر ${product.name}`}
                              value={product.price}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ''
                                    ? 0
                                    : Number(e.target.value);
                                updateProductPrice(product.id, val);
                                triggerSavedNotice(product.id);
                              }}
                              className="w-28 px-3 py-2 rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-sm font-bold text-[#1C1610] tabular-nums focus:outline-none focus:border-[#8C5E0B]"
                            />
                            {justSaved && (
                              <span className="inline-flex items-center gap-1 text-xs text-[#1D6F42] font-medium whitespace-nowrap">
                                <Check className="w-3.5 h-3.5" />
                                حُفظ
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isUnset ? (
                            <div className="text-xs">
                              <span className="font-bold text-[#1C1610] tabular-nums">
                                ---
                              </span>{' '}
                              <span className="text-[#8C5E0B]">
                                (ضع سعرك هنا)
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-[#1D6F42] tabular-nums">
                              {product.price.toLocaleString('en-US')} ر.س
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              updateProduct(product.id, {
                                inStock: !product.inStock,
                              })
                            }
                            className={`text-xs font-medium px-2.5 py-1 rounded border cursor-pointer ${
                              product.inStock
                                ? 'border-[#CFE5D8] bg-[#F2FBF5] text-[#1D6F42]'
                                : 'border-[#F4C7C3] bg-[#FEF3F2] text-[#B42318]'
                            }`}
                          >
                            {product.inStock ? 'متوفر' : 'غير متوفر'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {confirmDeleteId === product.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteProduct(product.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2.5 py-1.5 rounded bg-[#B42318] text-white text-xs font-medium cursor-pointer"
                              >
                                تأكيد الحذف
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1.5 rounded border border-[#D4C4A8] text-xs text-[#5C4E3C] cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditForm(product)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D4C4A8] text-xs font-medium text-[#1C1610] hover:bg-[#F4EFE6] cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(product.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#F4C7C3] text-xs font-medium text-[#B42318] hover:bg-[#FEF3F2] cursor-pointer"
                                aria-label={`حذف ${product.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Utility Reset Controls */}
        <section className="p-5 rounded-xl bg-white border border-[#E6DBC8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-[#5C4E3C]">
            أدوات سريعة لإعادة ضبط الأسعار أو استعادة القائمة التأسيسية للمتجر.
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {confirmResetMode === 'prices' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8C5E0B] font-medium">
                  تصفير كل الأسعار والشحن؟
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetAllPricesToZero();
                    setConfirmResetMode(null);
                  }}
                  className="px-3 py-1.5 rounded bg-[#8C5E0B] text-white text-xs font-medium cursor-pointer"
                >
                  نعم، صفّر
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetMode(null)}
                  className="px-3 py-1.5 rounded border border-[#D4C4A8] text-xs cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetMode('prices')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D4C4A8] text-xs font-medium text-[#1C1610] hover:bg-[#F4EFE6] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تصفير جميع الأسعار إلى 0</span>
              </button>
            )}

            {confirmResetMode === 'all' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#B42318] font-medium">
                  استعادة القائمة الأصلية؟
                </span>
                <button
                  type="button"
                  onClick={() => {
                    resetStoreToDefaults();
                    setConfirmResetMode(null);
                  }}
                  className="px-3 py-1.5 rounded bg-[#B42318] text-white text-xs font-medium cursor-pointer"
                >
                  نعم، استعد
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetMode(null)}
                  className="px-3 py-1.5 rounded border border-[#D4C4A8] text-xs cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetMode('all')}
                className="px-3.5 py-2 rounded-lg border border-[#F4C7C3] text-xs font-medium text-[#B42318] hover:bg-[#FEF3F2] cursor-pointer"
              >
                استعادة الافتراضي
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
