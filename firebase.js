// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getFunctions
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js";

// EarnX Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz2Fd88t535LsBxJJU4Epf8z72CbJWUpc",
  authDomain: "earnx-8218d.firebaseapp.com",
  projectId: "earnx-8218d",
  storageBucket: "earnx-8218d.firebasestorage.app",
  messagingSenderId: "661141581905",
  appId: "1:661141581905:web:ccc3895a4ca80f3b768870",
  measurementId: "G-8Z9918LQHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
const auth = getAuth(app);

// Google Sign-In provider
const googleProvider = new GoogleAuthProvider();

// Cloud Firestore
const db = getFirestore(app);

// Cloud Functions
const functions = getFunctions(app, "asia-south1");

// Export for other EarnX files
export {
  app,
  auth,
  googleProvider,
  db,
  functions
};
