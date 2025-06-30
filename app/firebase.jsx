// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase milikmu
const firebaseConfig = {
  apiKey: "AIzaSyDQEtBL5PGhDiRyRbtt4zVFmYYh73ponAU",
  authDomain: "booklistuas.firebaseapp.com",
  projectId: "booklistuas",
  storageBucket: "booklistuas.firebasestorage.app",
  messagingSenderId: "168096377266",
  appId: "1:168096377266:web:ad05adce102b752e93dcab",
  measurementId: "G-J3NLFVT7MK",
};
// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi auth & firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
