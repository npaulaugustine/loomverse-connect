
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA6w9Mc7ATpDu5I1GaVeLoikCPvjzE-p8",
  authDomain: "loomverse-d68f5.firebaseapp.com",
  projectId: "loomverse-d68f5",
  storageBucket: "loomverse-d68f5.firebasestorage.app",
  messagingSenderId: "762610301143",
  appId: "1:762610301143:web:6d42f29b0b3159fc9e1892",
  measurementId: "G-QRB3B1230E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestore, storage };
