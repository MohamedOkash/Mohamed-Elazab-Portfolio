import { isFirebaseConfigured } from './firebaseEnv';

let authInstance = null;

export const getAuthClient = async () => {
  if (authInstance) return authInstance;
  if (!isFirebaseConfigured) return null;
  const { getAuth } = await import('firebase/auth');
  const { app } = await import('./firebaseApp');
  if (app) {
    authInstance = getAuth(app);
  }
  return authInstance;
};

export { isFirebaseConfigured };

