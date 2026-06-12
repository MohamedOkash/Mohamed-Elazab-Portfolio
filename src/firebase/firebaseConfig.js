import { isFirebaseConfigured } from './firebaseEnv';

let dbInstance = null;

export const getDb = async () => {
  if (dbInstance) return dbInstance;
  if (!isFirebaseConfigured) return null;
  const { getFirestore } = await import('firebase/firestore');
  const { app } = await import('./firebaseApp');
  if (app) {
    dbInstance = getFirestore(app);
  }
  return dbInstance;
};

export { isFirebaseConfigured };

