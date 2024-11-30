// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection, addDoc } = require("firebase/firestore");
const dotenv = require("dotenv");
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

module.exports = {
    app, db
}