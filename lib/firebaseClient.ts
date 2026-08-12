import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB2fCMYGgRHXYOiiESoQeqg9F_BIS2pS60",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "splitmate-d2d66.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "splitmate-d2d66",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "splitmate-d2d66.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "563027170263",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:563027170263:android:4b72f0d1051e81d406f192",
};

export const getClientAuth = () => {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
};
