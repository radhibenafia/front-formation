import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore from firebase/firestore


const firebaseConfig = {
  apiKey: "AIzaSyCvL5bBFDi9em_DYAnz93mcz5he1W3cKS4",
  authDomain: "apiradhi-3a03f.firebaseapp.com",
  projectId: "apiradhi-3a03f",
  storageBucket: "apiradhi-3a03f.appspot.com",
  messagingSenderId: "562975475551",
  appId: "1:562975475551:web:b5307c27ed88713bd318ea",
  measurementId: "G-V9NSCBBQJD"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Correctly initialize Firestore
const analytics = getAnalytics(app);

export { firestore };
