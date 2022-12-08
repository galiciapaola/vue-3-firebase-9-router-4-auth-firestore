import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNk30qjo7Ppm9THmB1w0yk-cx5Lt03xOc",
  authDomain: "vue-3-2022-ac95d.firebaseapp.com",
  projectId: "vue-3-2022-ac95d",
  storageBucket: "vue-3-2022-ac95d.appspot.com",
  messagingSenderId: "809637255134",
  appId: "1:809637255134:web:b33c0d1be54ca8fccbaf4f"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);

export { auth, db , storage };