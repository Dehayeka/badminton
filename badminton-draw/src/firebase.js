// src/firebase.js 
// Ekspor semua yang dibutuhkan untuk inisialisasi Firebase

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 

// KONFIGURASI FIREBASE ANDA
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


// --- Penyiapan Global Variables (Dipindahkan ke sini) ---
// Lokasi penyimpanan (Public data) - DEKLARASI & EKSPOR BARU
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const HISTORY_COLLECTION_PATH = `/artifacts/${appId}/public/data/matchHistory`;


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
      // Pengecekan klien untuk menghindari crash di Vercel Build/SSR
      if (typeof window !== 'undefined') { 
          analytics = getAnalytics(app);
      }
    } catch (e) {
      console.warn("Analytics failed to initialize. Skipping.", e);
    }
}


// Ekspor semua layanan, termasuk HISTORY_COLLECTION_PATH
export { app, db, auth, analytics, HISTORY_COLLECTION_PATH };