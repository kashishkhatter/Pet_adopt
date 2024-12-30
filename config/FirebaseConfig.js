// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA1HRzA-WJTQhkoVpISujYzE6E4qTqmRQ",
  authDomain: "pet-adopt-5a8ba.firebaseapp.com",
  projectId: "pet-adopt-5a8ba",
  storageBucket: "pet-adopt-5a8ba.firebasestorage.app",
  messagingSenderId: "501944550785",
  appId: "1:501944550785:web:14b9d1e3a3acb595b51480",
  measurementId: "G-QLNRJYPC2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app) //const db contains our database info that can be used throughout app(exported)
//const analytics = getAnalytics(app);//