// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhTVy8niadgNaR8ir1l2tmZE5M-yuTxRg",
  authDomain: "the-getaway-548ff.firebaseapp.com",
  projectId: "the-getaway-548ff",
  storageBucket: "the-getaway-548ff.appspot.com",
  messagingSenderId: "513220021892",
  appId: "1:513220021892:web:abd003cfe802bb6390fcd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
//export const auth = getAuth(app);
