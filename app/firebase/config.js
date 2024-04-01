import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCgBKV9Pyn2qTPWZPFuMrUDauLSnE5FgmE",

  authDomain: "linkfolio-12e11.firebaseapp.com",

  databaseURL: "https://linkfolio-12e11-default-rtdb.firebaseio.com",

  projectId: "linkfolio-12e11",

  storageBucket: "linkfolio-12e11.appspot.com",

  messagingSenderId: "913257243047",

  appId: "1:913257243047:web:76ab22bc8522c604315682"

};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
