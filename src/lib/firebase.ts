import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import aiStudioConfig from '../../firebase-applet-config.json';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isViteEnv = apiKey && typeof apiKey === 'string' && apiKey.length > 5;

// If VITE_FIREBASE_API_KEY is not provided, fallback to the user's provided geotracker config
const fallbackConfig = {
  apiKey: "AIzaSyC40-D6w9NcaqlLr3pWPkq00jtfe9wNuNE",
  authDomain: "geotrainer-4aad9.firebaseapp.com",
  projectId: "geotrainer-4aad9",
  storageBucket: "geotrainer-4aad9.firebasestorage.app",
  messagingSenderId: "132316450953",
  appId: "1:132316450953:web:8ea18e580138dfa5a2b658",
  measurementId: "G-BMK89K3ZFN"
};

const firebaseConfig = isViteEnv ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} : fallbackConfig;

console.log("Firebase Init using config from:", isViteEnv ? "VITE_ENV" : "FALLBACK_JSON");

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app, isViteEnv ? undefined : undefined);

export { app, auth, db, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, doc, setDoc, getDoc, updateDoc };
