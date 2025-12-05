import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBh191MKqgfGs1UPJFEuVgW_C7VoXIKId4",
  authDomain: "mekelle-university-ai.firebaseapp.com",
  projectId: "mekelle-university-ai",
  storageBucket: "mekelle-university-ai.firebasestorage.app",
  messagingSenderId: "719481036353",
  appId: "1:719481036353:web:02d48a981b0eb05098b0c0",
  measurementId: "G-15KZL25K72"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
