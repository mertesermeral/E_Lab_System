import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.firebasestorage.app",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:7d843249c8ea98f9fb3d4b",
  measurementId: "***REMOVED***"
};

// Firebase Bağlantısı
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db}