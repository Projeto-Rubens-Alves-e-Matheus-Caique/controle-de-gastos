// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDn4T30xCtgWXa2uv4xN93AvcTPsq2kIEg",
  authDomain: "projetos-2026-1---matheusc.firebaseapp.com",
  databaseURL: "https://projetos-2026-1---matheusc-default-rtdb.firebaseio.com",
  projectId: "projetos-2026-1---matheusc",
  storageBucket: "projetos-2026-1---matheusc.firebasestorage.app",
  messagingSenderId: "788153572376",
  appId: "1:788153572376:web:0b64757ec7dc7e05a8f76d",
  measurementId: "G-50Q0B5VJDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
