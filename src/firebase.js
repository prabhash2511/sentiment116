import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this line

const firebaseConfig = {
    apiKey: "AIzaSyCDKw3K-mFeRSOkmRGi57sFH9DLP_tXtv0",
    authDomain: "sentiment-116.firebaseapp.com",
    projectId: "sentiment-116",
    storageBucket: "sentiment-116.firebasestorage.app",
    messagingSenderId: "618471339681",
    appId: "1:618471339681:web:796463c954cf485ec6a2e0",
    measurementId: "G-VMZYX3GTZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app); // Add this line
