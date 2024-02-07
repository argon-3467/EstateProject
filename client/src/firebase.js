// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "process.env.VITE_FIREBASE_API_KEY",
  authDomain: "mern-estate-e3806.firebaseapp.com",
  projectId: "mern-estate-e3806",
  storageBucket: "mern-estate-e3806.appspot.com",
  messagingSenderId: "44961455840",
  appId: "1:44961455840:web:f7a210598610f5b1247a85"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);