import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzy9wkCv0NoayQccmXEGvoEBRLsQyyFiU",
  authDomain: "music-player-b8a63.firebaseapp.com",
  projectId: "music-player-b8a63",
  storageBucket: "music-player-b8a63.appspot.com",
  messagingSenderId: "643751814033",
  appId: "1:643751814033:web:2ce0a3066029c66899b030",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const signup = async (email, password) => {
  try {
    const auth = getAuth();
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(errorMessage, errorCode);
  }
};

export const signin = async (email, password) => {
  try {
    const auth = getAuth();
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(errorMessage, errorCode);
  }
};
