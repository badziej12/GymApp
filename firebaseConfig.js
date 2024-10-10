// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getReactNativePersistence, initializeAuth } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiO8RQtZSMvN50jvHAMH_BaQMTRWUFEe8",
  authDomain: "gymapp-322c1.firebaseapp.com",
  projectId: "gymapp-322c1",
  storageBucket: "gymapp-322c1.appspot.com",
  messagingSenderId: "615447296216",
  appId: "1:615447296216:web:88867b3f463f369090ffad",
  measurementId: "G-XZEC4W6HP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
