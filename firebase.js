// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLiUbVyVDBI_iC5UPoyO1NC1Wa0pg4bxQ",
  authDomain: "toolsworx-344a5.firebaseapp.com",
  projectId: "toolsworx-344a5",
  storageBucket: "toolsworx-344a5.firebasestorage.app",
  messagingSenderId: "905466639122",
  appId: "1:905466639122:web:5431bc2d9aed9aaba439cb",
  measurementId: "G-MJ0LMXQYNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);