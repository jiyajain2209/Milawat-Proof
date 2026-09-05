import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';

/**
 * Subscribes to real-time updates for all orders from the "orders" collection.
 * Sorts orders newest first based on createdAt ISO string.
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as Omit<Order, 'id'>;
        orders.push({
          ...data,
          id: docSnapshot.id,
        });
      });

      // Sort newest first by creation timestamp
      orders.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      onUpdate(orders);
    },
    (err) => {
      console.error('Error fetching orders from Firestore:', err);
      onError(err);
    }
  );
}

/**
 * Updates the status of an existing order and optionally updates admin notes.
 */
export async function updateOrderStatus(
  orderDocId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<void> {
  const orderRef = doc(db, 'orders', orderDocId);
  const updateData: Partial<Order> = {
    orderStatus: newStatus,
  };
  if (notes !== undefined) {
    updateData.notes = notes;
  }
  await updateDoc(orderRef, updateData);
}

/**
 * Updates the admin notes field of an existing order.
 */
export async function updateOrderNotes(
  orderDocId: string,
  notes: string
): Promise<void> {
  const orderRef = doc(db, 'orders', orderDocId);
  await updateDoc(orderRef, { notes });
}
