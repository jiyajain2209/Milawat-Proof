import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Lazy, safe initialization for Auth to prevent module-evaluation registration race conditions
let cachedAuth: Auth | null = null;
export function getFirebaseAuth(): Auth {
  if (!cachedAuth) {
    try {
      cachedAuth = getAuth(app);
    } catch (err) {
      console.warn('Firebase Auth initialization notice:', err);
      // Retry once in case of micro-task registration timing
      cachedAuth = getAuth(app);
    }
  }
  return cachedAuth;
}

export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const instance = getFirebaseAuth();
    const val = Reflect.get(instance, prop);
    return typeof val === 'function' ? val.bind(instance) : val;
  },
  set(_target, prop, value) {
    const instance = getFirebaseAuth();
    return Reflect.set(instance, prop, value);
  },
});

// Lazy, safe initialization for Storage
let cachedStorage: FirebaseStorage | null = null;
export function getFirebaseStorage(): FirebaseStorage {
  if (!cachedStorage) {
    cachedStorage = getStorage(app);
  }
  return cachedStorage;
}

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_target, prop) {
    const instance = getFirebaseStorage();
    const val = Reflect.get(instance, prop);
    return typeof val === 'function' ? val.bind(instance) : val;
  },
  set(_target, prop, value) {
    const instance = getFirebaseStorage();
    return Reflect.set(instance, prop, value);
  },
});

export default app;

