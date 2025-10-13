// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDOtzYG3CR22ZLJEzsBO2yn6oI4ohxhSo",
    authDomain: "san-miguel-f34b3.firebaseapp.com",
    projectId: "san-miguel-f34b3",
    storageBucket: "san-miguel-f34b3.firebasestorage.app",
    messagingSenderId: "732217052445",
    appId: "1:732217052445:web:f6a147572f6ff9201f25f4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);