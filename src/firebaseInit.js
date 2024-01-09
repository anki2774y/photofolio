// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQwsXj3H91rKNy5i2fE4kVbyDbSLQyDis",
    authDomain: "photofolio-6a861.firebaseapp.com",
    projectId: "photofolio-6a861",
    storageBucket: "photofolio-6a861.appspot.com",
    messagingSenderId: "760659941665",
    appId: "1:760659941665:web:59268f4e5e7edfdd430660"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;