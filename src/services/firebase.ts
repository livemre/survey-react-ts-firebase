// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAT63ZXvy1Vsra6w-Mgpxya_Um_GBZIpf8",
    authDomain: "survey-f1b82.firebaseapp.com",
    projectId: "survey-f1b82",
    storageBucket: "survey-f1b82.appspot.com",
    messagingSenderId: "818679905664",
    appId: "1:818679905664:web:3056bf5319d53199619565"
  };
  


// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);



// Initialize Firebase Authentication and get a reference to the service
 const auth = getAuth(app);

 const db = getFirestore(app);

export {auth, db, storage, storageRef}