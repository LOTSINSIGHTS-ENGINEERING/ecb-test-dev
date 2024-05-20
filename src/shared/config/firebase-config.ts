import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATQ4mVa5n8Vhpi-cm_HK1uMMQ5vMLRWro",
  authDomain: "ecbdevelopment-9eafc.firebaseapp.com",
  projectId: "ecbdevelopment-9eafc",
  storageBucket: "ecbdevelopment-9eafc.appspot.com",
  messagingSenderId: "328176385844",
  appId: "1:328176385844:web:61b1ef0392c28021a6ef61",
  measurementId: "G-13K3YGY0NE",

  // apiKey: "AIzaSyArWNgVs94aSDyfVS-hhIMNpBf_bBZa1ow",
  // authDomain: "ecb-pms.firebaseapp.com",
  // projectId: "ecb-pms",
  // storageBucket: "ecb-pms.appspot.com",
  // messagingSenderId: "169801932469",
  // appId: "1:169801932469:web:27879d9cbee1f3d307e8fc",
  // measurementId: "G-NZ5QW3FHH0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuthWorker = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const authWorker = getAuth(appAuthWorker);
export const storage = getStorage(app);

// apiKey: "AIzaSyATQ4mVa5n8Vhpi-cm_HK1uMMQ5vMLRWro",
// authDomain: "ecbdevelopment-9eafc.firebaseapp.com",
// projectId: "ecbdevelopment-9eafc",
// storageBucket: "ecbdevelopment-9eafc.appspot.com",
// messagingSenderId: "328176385844",
// appId: "1:328176385844:web:61b1ef0392c28021a6ef61",
// measurementId: "G-13K3YGY0NE"

// 2220954
