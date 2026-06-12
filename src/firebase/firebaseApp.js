import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseOptions, isFirebaseConfigured } from './firebaseEnv';

export const app = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(firebaseOptions))
  : null;
