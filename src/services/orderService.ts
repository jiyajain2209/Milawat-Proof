import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, CartItem } from '../types';

export interface PreOrderSubmissionData {
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  items: CartItem[];
}

/**
 * Generates a memorable, unique pre-order reference code (e.g., ORD-MP-84920-K7F2)
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-5);
  const randomAlpha = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-MP-${timestamp}-${randomAlpha}`;
}

/**
 * Creates a new pre-order document in the Firestore "orders" collection.
 * Default status is strictly "Pending".
 */
export async function createPreOrder(data: PreOrderSubmissionData): Promise<Order> {
  const orderId = generateOrderId();
  const createdAt = new Date().toISOString();

  const formattedItems = data.items.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    tier: (item.product.tier === 'multi' ? 'multi-use' : 'single-use') as 'single-use' | 'multi-use',
    quantity: item.quantity,
    pricePerItem: item.product.price,
  }));

  const orderTotal = formattedItems.reduce(
    (sum, item) => sum + item.pricePerItem * item.quantity,
    0
  );

  const newOrder: Omit<Order, 'id'> = {
    orderId,
    customerName: data.customerName.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    deliveryAddress: data.deliveryAddress.trim(),
    items: formattedItems,
    orderTotal,
    orderStatus: 'Pending',
    createdAt,
    notes: '',
  };

  const docRef = await addDoc(collection(db, 'orders'), newOrder);

  return {
    ...newOrder,
    id: docRef.id,
  };
}
