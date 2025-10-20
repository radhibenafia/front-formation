import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore from firebase/firestore


const firebaseConfig 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Correctly initialize Firestore
const analytics = getAnalytics(app);

export { firestore };
