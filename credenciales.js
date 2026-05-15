// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1APmj6zRT9MMRyj_MbOFUqYPHKeQ8NLA",
  authDomain: "proyecto-nexora.firebaseapp.com",
  projectId: "proyecto-nexora",
  storageBucket: "proyecto-nexora.firebasestorage.app",
  messagingSenderId: "1022117618525",
  appId: "1:1022117618525:web:e0b23414604812aa7bbeb4",
  measurementId: "G-LEWK19JJ1C"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase
const analytics = getAnalytics(appFirebase);