// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeKGO2DSb7lIfcWK60TXuzSKurPMqahjg",
  authDomain: "recepie-list-f00b1.firebaseapp.com",
  projectId: "recepie-list-f00b1",
  storageBucket: "recepie-list-f00b1.appspot.com",
  messagingSenderId: "824684683804",
  appId: "1:824684683804:web:10ed2a0609dc021a77b5d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
