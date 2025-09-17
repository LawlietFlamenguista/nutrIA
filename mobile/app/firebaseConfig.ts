import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyA8txEvYdloAc8hkwvttmzyTMvSQBYVMdM",
  authDomain: "nutria-3bfa4.firebaseapp.com",
  projectId: "nutria-3bfa4",
  storageBucket: "nutria-3bfa4.appspot.com", 
  messagingSenderId: "788626321810",
  appId: "1:788626321810:web:785965495ff66e43d2514b",
  measurementId: "G-T9QWY3LGG2"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);