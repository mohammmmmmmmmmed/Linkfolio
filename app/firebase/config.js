import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCgBKV9Pyn2qTPWZPFuMrUDauLSnE5FgmE
NEXT_PUBLIC_AUTH_DOMAIN=linkfolio-12e11.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=linkfolio-12e11
NEXT_PUBLIC_STORAGE_BUCKET=linkfolio-12e11.appspot.com
NEXT_PUBLIC_APP_ID=1:913257243047:web:76ab22bc8522c604315682
NEXT_PUBLIC_MEASUREMENT_ID=  // This one is omitted as it's not provided in your input
MESSAGING_SENDER_ID=913257243047

};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
