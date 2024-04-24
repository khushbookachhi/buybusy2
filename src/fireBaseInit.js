// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYKIb2s3XmYhoplQsBpu2zi-xnf_Cp2xA",
    authDomain: "buybusy2-e207d.firebaseapp.com",
    projectId: "buybusy2-e207d",
    storageBucket: "buybusy2-e207d.appspot.com",
    messagingSenderId: "12007550192",
    appId: "1:12007550192:web:f33d78426a5395cd422635"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth();
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

