import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';
import { getAnalytics } from 'firebase/analytics';
import aiStudioConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  ...aiStudioConfig,
  measurementId: "G-BMK89K3ZFN"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Guard Performance Monitoring and Analytics to only initialize in the browser
if (typeof window !== "undefined") {
  getPerformance(app);
  getAnalytics(app);
}

export { app, auth, db, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, doc, setDoc, getDoc, updateDoc };

