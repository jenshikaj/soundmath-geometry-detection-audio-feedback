import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase configuration object containing keys and identifiers for the app
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initializes the Firebase application
const auth = getAuth(app); // Sets up Firebase Authentication for the app
const db = getFirestore(app); // Sets up Firestore database for the app

// Exporting the authentication and database objects for use throughout the app
export { auth, db, collection, getDocs };