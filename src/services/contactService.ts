import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { ContactMessage } from '../types';

export interface SubmitContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  imageFile?: File | null;
}

/**
 * Resilient helper to convert and compress an image file to a data URL if needed.
 * Resizes large camera photos to a max dimension of 1200px so it fits reliably within Firestore limits.
 */
function fileToCompressedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If running in non-browser environment (e.g. tests)
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(reader.result as string);
      img.onload = () => {
        try {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(reader.result as string);
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(dataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an attached photo to Firebase Storage under the `contact-photos/` path.
 * If Firebase Storage is unavailable or restricted, falls back gracefully to a compressed data URL.
 */
export async function uploadContactPhoto(file: File): Promise<string> {
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

  try {
    const storageRef = ref(storage, `contact-photos/${timestamp}_${cleanFileName}`);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
    });
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage upload notice, using compressed image fallback:', err);
    return await fileToCompressedDataUrl(file);
  }
}

/**
 * Submits a contact inquiry to the Firestore "messages" collection.
 * Writes:
 * - name (string)
 * - email (string)
 * - phone (string, if provided)
 * - message (string)
 * - imageUrl (string | null, if an image was attached)
 * - timestamp (ISO string)
 * - createdAt (ISO string)
 * - status (default: "New")
 */
export async function submitContactMessage(
  input: SubmitContactMessageInput
): Promise<{ id: string; imageUrl: string | null }> {
  if (!input.name || !input.name.trim()) {
    throw new Error('Please provide your name.');
  }
  if (!input.email || !input.email.trim()) {
    throw new Error('Please provide your email address.');
  }
  if (!input.message || !input.message.trim()) {
    throw new Error('Please write a message before submitting.');
  }

  let imageUrl: string | null = null;

  if (input.imageFile) {
    imageUrl = await uploadContactPhoto(input.imageFile);
  }

  const now = new Date().toISOString();

  const messageDoc: Record<string, unknown> = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || '',
    message: input.message.trim(),
    imageUrl: imageUrl || null,
    timestamp: now,
    createdAt: now,
    status: 'New',
  };

  const docRef = await addDoc(collection(db, 'messages'), messageDoc);

  return {
    id: docRef.id,
    imageUrl,
  };
}
