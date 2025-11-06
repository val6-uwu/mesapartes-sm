// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("❌ Error: Firebase configuration is missing!");
    console.error("📝 Make sure you have created a .env file with all required variables.");
    console.error("📄 Check .env.example for reference.");
    throw new Error(
        'Firebase configuration is incomplete. Please check your .env file.'
    );
}
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    throw error;
}
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;