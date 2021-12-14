import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import {getFirestore} from '@firebase/firestore'


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSender: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appID: process.env.REACT_APP_APP_ID,
  mesurementId: process.env.REACT_APP_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app);
export const storageRef = ref(storage)

export const db = getFirestore(app)
