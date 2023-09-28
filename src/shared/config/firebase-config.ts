import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-leoC1vNHq1vGSN8I2GInx7TEt3qE9x8",
  authDomain: "ecb-dev-test.firebaseapp.com",
  projectId: "ecb-dev-test",
  storageBucket: "ecb-dev-test.appspot.com",
  messagingSenderId: "40736981303",
  appId: "1:40736981303:web:ebbe73b1fd496c87415ab2",
  measurementId: "G-PYMF37NWLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appAuthWorker = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const authWorker = getAuth(appAuthWorker);
export const storage = getStorage(app);
