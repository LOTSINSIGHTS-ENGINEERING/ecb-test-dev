import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArWNgVs94aSDyfVS-hhIMNpBf_bBZa1ow",
  authDomain: "ecb-pms.firebaseapp.com",
  projectId: "ecb-pms",
  storageBucket: "ecb-pms.appspot.com",
  messagingSenderId: "169801932469",
  appId: "1:169801932469:web:27879d9cbee1f3d307e8fc",
  measurementId: "G-NZ5QW3FHH0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuthWorker = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const authWorker = getAuth(appAuthWorker);
export const storage = getStorage(app);
