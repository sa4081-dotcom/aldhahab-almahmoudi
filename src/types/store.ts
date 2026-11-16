export type ProductCategory = 'سمن' | 'عسل' | 'بكجات';

export type FilterCategory = 'الكل' | ProductCategory;

export type PaymentMethod = 'عند الاستلام' | 'Apple Pay' | 'مدى' | 'STC Pay';

export type ViewMode = 'store' | 'admin';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  weight: string;
  description: string;
  image: string;
  inStock: boolean;
}

export interface StoreSettings {
  shippingCost: number;
  freeShippingThreshold: number;
  whatsappNumber: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CustomerOrderForm {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  city: string;
  productPurchased: string;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
