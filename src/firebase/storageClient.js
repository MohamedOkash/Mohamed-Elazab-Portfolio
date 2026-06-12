import { isFirebaseConfigured } from './firebaseEnv';

let storageInstance = null;

export const getStorageClient = async () => {
  if (storageInstance) return storageInstance;
  if (!isFirebaseConfigured) return null;
  const { getStorage } = await import('firebase/storage');
  const { app } = await import('./firebaseApp');
  if (app) {
    storageInstance = getStorage(app);
  }
  return storageInstance;
};

export { isFirebaseConfigured };

