// src/firebase.js 
// Ekspor semua yang dibutuhkan untuk inisialisasi Firebase

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 

const userFirebaseConfig = {
  apiKey: "AIzaSyDKT0Xr_aw5_e_TC_Pxd3YyYLR0OapiOFE",
  authDomain: "badmintondrawapp.firebaseapp.com",
  projectId: "badmintondrawapp",
  storageBucket: "badmintondrawapp.firebasestorage.app",
  messagingSenderId: "58022733890",
  appId: "1:58022733890:web:cd5b2086a9c09ea69425db",
  measurementId: "G-HNJEY49CJ6"
};

// Logika Canvas yang sama
const __firebase_config = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const firebaseConfig = __firebase_config.projectId ? __firebase_config : userFirebaseConfig;


// --- Inisialisasi ---
let app = null;
let db = null;
let auth = null;
let analytics = null;

if (firebaseConfig.projectId) { 
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    try {
      // Pindahkan inisialisasi analytics ke dalam pengecekan browser
      if (typeof window !== 'undefined') { 
          analytics = getAnalytics(app);
      }
    } catch (e) {
      console.warn("Analytics failed to initialize. Skipping.", e);
    }
}


// Ekspor semua layanan yang akan digunakan di komponen React
export { app, db, auth, analytics };