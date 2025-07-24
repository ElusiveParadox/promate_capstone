// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyAx4v07qVIZnHLfBLRac4iyWrGDLsytCgo",
//     authDomain: "promate-3cd61.firebaseapp.com",
//     projectId: "promate-3cd61",
//     storageBucket: "promate-3cd61.firebasestorage.app",
//     messagingSenderId: "656673594611",
//     appId: "1:656673594611:web:4fd9d63b6d2305211a2b86"
//   };

//   const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
//   const db = getFirestore(app);

//   export {db};

import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeFirestore,
  memoryLocalCache,
  // persistentLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAx4v07qVIZnHLfBLRac4iyWrGDLsytCgo",
  authDomain: "promate-3cd61.firebaseapp.com",
  projectId: "promate-3cd61",
  storageBucket: "promate-3cd61.firebasestorage.app",
  messagingSenderId: "656673594611",
  appId: "1:656673594611:web:4fd9d63b6d2305211a2b86"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 💡 Replace caching with in-memory cache to avoid internal corrupted state
const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

export { db };
