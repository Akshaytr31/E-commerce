// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyAc7ERJQAZH6Kuju1U_fbg4heWo-twxZIo",
  authDomain: "e-commerce-fbb9a.firebaseapp.com",
  projectId: "e-commerce-fbb9a",
  storageBucket: "e-commerce-fbb9a.firebasestorage.app",
  messagingSenderId: "107697808364",
  appId: "1:107697808364:web:4f9322eae1f3cb16b416c9",
  measurementId: "G-ZRVN7NHCRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth=getAuth(app)

export {app,auth}

