import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyARXdjSU3RsFNviFJnjqilFwBxos7g6jYo",
    authDomain: "despesas-fit.firebaseapp.com",
    projectId: "despesas-fit",
    storageBucket: "despesas-fit.appspot.com",
    messagingSenderId: "822040805046",
    appId: "1:822040805046:web:a5d765a60fb1d8081bb017"
  };
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 