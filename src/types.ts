export interface Product {
  id: string;
  name: string;
  category: 'milk' | 'paneer' | 'ghee' | 'bundle';
  tier: 'single' | 'multi';
  tierLabel: 'Single-Use' | 'Multi-Use';
  tagline: string;
  description: string;
  testsCovered: string[];
  price: number;
  originalPrice?: number;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  testCount: string;
  testDuration: string;
  whatsInside: string[];
  sampleRequired: string;
  dimensions: string;
  batchNo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Fulfilled' | 'Cancelled';

export interface OrderItem {
  productId?: string;
  productName: string;
  tier: 'single-use' | 'multi-use';
  quantity: number;
  pricePerItem: number;
}

export interface Order {
  id?: string; // Firestore document ID
  orderId: string; // User-facing order ID e.g. ORD-MP-12345
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  items: OrderItem[];
  orderTotal: number;
  orderStatus: OrderStatus;
  createdAt: string; // ISO string format
  notes: string;
}
