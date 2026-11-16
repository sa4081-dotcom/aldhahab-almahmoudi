import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerOrderForm, PaymentMethod } from '../types/store';
import { ResilientImage } from './ResilientImage';

const PAYMENT_METHODS: PaymentMethod[] = [
  'عند الاستلام',
  'Apple Pay',
  'مدى',
  'STC Pay',
];

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    products,
    settings,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    effectiveShipping,
    isFreeShippingUnlocked,
    amountRemainingForFreeShipping,
    cartTotal,
    hasUnpricedItemsInCart,
  } = useStore();

  const [form, setForm] = useState<CustomerOrderForm>({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'عند الاستلام',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerOrderForm, string>>>({});
  const [submittedOrderText, setSubmittedOrderText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const detailedItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: product.price > 0 ? product.price * item.quantity : 0,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart, products]);

  const buildWhatsAppMessage = () => {
    const lines: string[] = [
      'السلام عليكم، طلب جديد من متجر *الذهب الطبيعي - المحمودي*',
      '',
      '*بيانات العميل:*',
      `الاسم: ${form.fullName.trim()}`,
      `الجوال: ${form.phone.trim()}`,
      `المدينة: ${form.city.trim()}`,
      `العنوان: ${form.address.trim()}`,
      `طريقة الدفع: ${form.paymentMethod}`,
    ];

    if (form.notes.trim()) {
      lines.push(`ملاحظات: ${form.notes.trim()}`);
    }

    lines.push('', '*تفاصيل الطلب:*');

    detailedItems.forEach((item, idx) => {
      const priceStr =
        item.product.price > 0
          ? `${item.product.price} ر.س × ${item.quantity} = ${item.lineTotal} ر.س`
          : `الكمية: ${item.quantity} (السعر يحدد من المتجر)`;
      lines.push(`${idx + 1}. ${item.product.name} — ${priceStr}`);
    });

    lines.push('');
    lines.push(`المجموع الفرعي: ${cartSubtotal} ر.س`);
    lines.push(
      `الشحن: ${
        isFreeShippingUnlocked
          ? 'مجاني (تجاوز حد الشحن المجاني)'
          : `${effectiveShipping} ر.س`
      }`
    );
    lines.push(`*الإجمالي النهائي: ${cartTotal} ر.س*`);

    if (hasUnpricedItemsInCart) {
      lines.push('ملاحظة: يوجد منتجات في السلة لم يتم تسعيرها بعد.');
    }

    return lines.join('\n');
  };

  const handleValidateAndPrepareOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof CustomerOrderForm, string>> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'يرجى إدخال الاسم الكامل';
    }
    if (!form.phone.trim() || form.phone.trim().length < 8) {
      nextErrors.phone = 'يرجى إدخال رقم جوال صحيح';
    }
    if (!form.city.trim()) {
      nextErrors.city = 'يرجى تحديد المدينة';
    }
    if (!form.address.trim()) {
      nextErrors.address = 'يرجى إدخال العنوان التفصيلي';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = buildWhatsAppMessage();
    setSubmittedOrderText(message);
  };

  const cleanPhone = settings.whatsappNumber.replace(/[^\d]/g, '') || '966500000000';
  const whatsappUrl = submittedOrderText
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(submittedOrderText)}`
    : '#';

  const handleCopyText = async () => {
    if (!submittedOrderText) return;
    try {
      await navigator.clipboard.writeText(submittedOrderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  if (!isCartOpen) return null;

  const progressPercent =
    settings.freeShippingThreshold > 0
      ? Math.min(100, Math.round((cartSubtotal / settings.freeShippingThreshold) * 100))
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="سلة التسوق وإتمام الطلب"
    >
      {/* Backdrop click to close */}
      <div
        className="flex-1"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="w-full max-w-lg bg-[#FBF9F5] text-[#1C1610] h-full flex flex-col border-r border-[#E7DEC9] shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E7DEC9] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#8C5E0B]" />
            <h2 className="font-display text-2xl font-bold text-[#1C1610]">
              سلة التسوق
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg text-[#5C4E3C] hover:bg-[#F1EAE0] hover:text-[#1C1610] transition-colors cursor-pointer"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {detailedItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#F1EAE0] flex items-center justify-center text-[#8C5E0B]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-[#1C1610] mb-1">
                سلة التسوق فارغة
              </p>
              <p className="text-sm text-[#6B5A45] mb-6">
                أضف منتجات السمن البلدي والعسل الطبيعي لبدء طلبك.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-lg bg-[#1C1610] text-white text-sm font-medium cursor-pointer"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : submittedOrderText ? (
            /* Order Confirmation & Direct WhatsApp Launch View */
            <div className="space-y-5">
              <div className="p-5 rounded-xl bg-white border border-[#DFCEAF] space-y-3">
                <div className="flex items-center gap-2.5 text-[#1D6F42]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-base font-bold text-[#1C1610]">
                    تم تجهيز تفاصيل طلبك بنجاح
                  </h3>
                </div>
                <p className="text-sm text-[#5C4E3C] leading-relaxed">
                  اضغط على الزر أدناه لفتح محادثة واتساب المتجر وإرسال الطلب مباشرة
                  مع جميع التفاصيل.
                </p>

                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 min-h-[48px] rounded-lg bg-[#1D6F42] text-white hover:bg-[#165834] transition-colors font-semibold text-sm"
                  >
                    <span>فتح واتساب لإرسال الطلب الآن</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 min-h-[42px] rounded-lg border border-[#D4C4A8] bg-[#FBF9F5] text-[#1C1610] hover:bg-[#EFE7D8] transition-colors text-xs font-medium cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'تم نسخ نص الطلب' : 'نسخ تفاصيل الطلب'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E7DEC9]">
                <div className="text-xs font-semibold text-[#6B5A45] mb-2">
                  معاينة رسالة الطلب:
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-[#3D3326] leading-relaxed">
                  {submittedOrderText}
                </pre>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSubmittedOrderText(null)}
                  className="px-4 py-2.5 rounded-lg border border-[#D4C4A8] text-xs font-medium text-[#1C1610] hover:bg-[#EFE7D8] cursor-pointer"
                >
                  تعديل البيانات
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearCart();
                    setSubmittedOrderText(null);
                    setIsCartOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#1C1610] text-white text-xs font-medium cursor-pointer"
                >
                  إفراغ السلة وإغلاق
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress Bar if threshold configured */}
              {settings.freeShippingThreshold > 0 && (
                <div className="p-4 rounded-xl bg-[#F5EFE3] border border-[#E2D4B7]">
                  <div className="flex items-center justify-between text-xs font-medium text-[#4A3B28] mb-2">
                    {isFreeShippingUnlocked ? (
                      <span className="text-[#1D6F42] font-semibold">
                        مبروك! تم تفعيل الشحن المجاني لطلبك
                      </span>
                    ) : (
                      <span className="tabular-nums">
                        أضف منتجات بقيمة{' '}
                        <strong className="text-[#1C1610]">
                          {amountRemainingForFreeShipping.toLocaleString('en-US')} ر.س
                        </strong>{' '}
                        للحصول على الشحن المجاني
                      </span>
                    )}
                    <span className="tabular-nums text-[#8C5E0B]">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#E5D8BF] overflow-hidden">
                    <div
                      className="h-full bg-[#8C5E0B] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="divide-y divide-[#E7DEC9] border-y border-[#E7DEC9]">
                {detailedItems.map(({ product, quantity, lineTotal }) => (
                  <div key={product.id} className="py-4 flex gap-3.5 items-start">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#F1EAE0] border border-[#E7DEC9] shrink-0">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#1C1610] leading-snug">
                          {product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 rounded text-[#7D6B53] hover:text-[#B42318] hover:bg-[#FEE4E2]/60 transition-colors cursor-pointer shrink-0"
                          aria-label={`حذف ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#6B5A45] mt-0.5 tabular-nums">
                        {product.price > 0
                          ? `${product.price.toLocaleString('en-US')} ر.س للوحدة`
                          : 'السعر: --- (ضع سعرك هنا من لوحة التحكم)'}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center border border-[#D4C4A8] rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#1C1610] hover:bg-[#F4EFE6] cursor-pointer"
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-semibold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#1C1610] hover:bg-[#F4EFE6] cursor-pointer"
                            aria-label="إنقاص الكمية"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-sm font-bold text-[#1C1610] tabular-nums">
                          {product.price > 0
                            ? `${lineTotal.toLocaleString('en-US')} ر.س`
                            : '---'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals Summary */}
              <div className="p-4 rounded-xl bg-white border border-[#E7DEC9] space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-[#5C4E3C]">
                  <span>المجموع الفرعي</span>
                  <span className="font-semibold text-[#1C1610] tabular-nums">
                    {cartSubtotal.toLocaleString('en-US')} ر.س
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#5C4E3C]">
                  <span>تكلفة الشحن</span>
                  <span className="font-semibold text-[#1C1610] tabular-nums">
                    {isFreeShippingUnlocked ? (
                      <span className="text-[#1D6F42]">مجاني</span>
                    ) : settings.shippingCost === 0 ? (
                      '0 ر.س (مفتوح)'
                    ) : (
                      `${effectiveShipping.toLocaleString('en-US')} ر.س`
                    )}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-[#EFE7D8] flex items-center justify-between text-base font-bold text-[#1C1610]">
                  <span>الإجمالي</span>
                  <span className="tabular-nums">
                    {cartTotal.toLocaleString('en-US')} ر.س
                  </span>
                </div>
                {hasUnpricedItemsInCart && (
                  <p className="text-xs text-[#8C5E0B] pt-1">
                    تنبيه: تحتوي السلة على أصناف بسعر 0 (يحدد السعر من لوحة التحكم).
                  </p>
                )}
              </div>

              {/* Customer Checkout Form */}
              <form onSubmit={handleValidateAndPrepareOrder} className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-[#1C1610]">
                  بيانات التوصيل والدفع
                </h3>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-medium text-[#4A3B28] mb-1.5"
                  >
                    الاسم الكامل *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => {
                      setForm({ ...form, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    placeholder="مثال: محمد العبدالله"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-white text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#B42318] mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-medium text-[#4A3B28] mb-1.5"
                    >
                      رقم الجوال *
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      dir="ltr"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="05XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-white text-sm text-[#1C1610] text-right focus:outline-none focus:border-[#8C5E0B]"
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-medium text-[#4A3B28] mb-1.5"
                    >
                      المدينة *
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={form.city}
                      onChange={(e) => {
                        setForm({ ...form, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: undefined });
                      }}
                      placeholder="الرياض، جدة، الدمام..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-white text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                    />
                    {errors.city && (
                      <p className="text-xs text-[#B42318] mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-medium text-[#4A3B28] mb-1.5"
                  >
                    العنوان التفصيلي *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address}
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: undefined });
                    }}
                    placeholder="الحي، الشارع، رقم المبنى أو أقرب معلم"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C4A8] bg-white text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  />
                  {errors.address && (
                    <p className="text-xs text-[#B42318] mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#4A3B28] mb-2">
                    طريقة الدفع
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((method) => {
                      const active = form.paymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setForm({ ...form, paymentMethod: method })}
                          className={`px-3 py-2.5 min-h-[42px] rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                            active
                              ? 'border-[#8C5E0B] bg-[#F5EFE3] text-[#1C1610] font-semibold'
                              : 'border-[#E2D6BE] bg-white text-[#5C4E3C] hover:border-[#CBB894]'
                          }`}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="block text-xs font-medium text-[#4A3B28] mb-1.5"
                  >
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="تفضيلات وقت التوصيل أو بطاقة إهداء..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#D4C4A8] bg-white text-sm text-[#1C1610] focus:outline-none focus:border-[#8C5E0B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 min-h-[48px] rounded-lg bg-[#8C5E0B] text-white hover:bg-[#734C08] transition-colors font-semibold text-sm cursor-pointer"
                >
                  تأكيد وإرسال الطلب عبر واتساب
                </button>
              </form>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
