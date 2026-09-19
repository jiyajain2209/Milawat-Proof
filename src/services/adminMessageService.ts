import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ContactMessage } from '../types';

/**
 * Subscribes in real-time to the "messages" collection in Firestore.
 * Always sorts messages newest first by creation timestamp.
 */
export function subscribeToMessages(
  onUpdate: (messages: ContactMessage[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: ContactMessage[] = [];
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as Omit<ContactMessage, 'id'>;
        messages.push({
          ...data,
          id: docSnapshot.id,
          status: data.status || 'New',
        });
      });

      // Sort newest first by timestamp or createdAt
      messages.sort((a, b) => {
        const timeA = new Date(a.createdAt || (a.timestamp as string) || 0).getTime();
        const timeB = new Date(b.createdAt || (b.timestamp as string) || 0).getTime();
        return timeB - timeA;
      });

      onUpdate(messages);
    },
    (err) => {
      console.error('Error listening to messages in Firestore:', err);
      onError(err);
    }
  );
}

/**
 * Updates the review status of a contact submission (e.g. 'New' -> 'Read' -> 'Replied')
 */
export async function updateMessageStatus(
  messageId: string,
  status: string
): Promise<void> {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Deletes a message from the "messages" collection if required by the admin.
 */
export async function deleteMessage(messageId: string): Promise<void> {
  const messageRef = doc(db, 'messages', messageId);
  await deleteDoc(messageRef);
}
