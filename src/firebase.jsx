// firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import the Realtime Database function

const firebaseConfig = {
    apiKey: "AIzaSyC8enww4Mwo4NQXU1AEts8WewT8dbZeXIw",
    authDomain: "growing-in-faith-a1582.firebaseapp.com",
    projectId: "growing-in-faith-a1582",
    storageBucket: "growing-in-faith-a1582.appspot.com",
    messagingSenderId: "12637438534",
    appId: "1:12637438534:web:e149aba57ef2a347074047",
    measurementId: "G-ZD49ZHL5P0",
    databaseURL: "https://growing-in-faith-a1582-default-rtdb.firebaseio.com/" // Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Realtime Database
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db }; // Export both `auth` and `db`
