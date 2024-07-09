import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAYi5nYgqUq11pBx7HSyejpfMNbQLUGzYE",
  authDomain: "wether-app-ff87b.firebaseapp.com",
  projectId: "wether-app-ff87b",
  storageBucket: "wether-app-ff87b.appspot.com",
  messagingSenderId: "468715274347",
  appId: "1:468715274347:web:f9d350cbd09ed15dc3b12e",
  measurementId: "G-1FX2ZVYN2W"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)