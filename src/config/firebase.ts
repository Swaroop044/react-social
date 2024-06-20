// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf2g1qnFLFDFLekhKX8QHtoYD4uM5SruU",
  authDomain: "react-course-567bb.firebaseapp.com",
  projectId: "react-course-567bb",
  storageBucket: "react-course-567bb.appspot.com",
  messagingSenderId: "1078219026829",
  appId: "1:1078219026829:web:4308a4b60a7fa15ee90dc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);