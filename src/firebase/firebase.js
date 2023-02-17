import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
// prettier-ignore
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,} from "firebase/auth";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

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

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();

const addUser = async (email, age, country, name, uid) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      email,
      name,
      age,
      country,
      uid,
    });

    console.log("USER STORED SUCCESSFULLY");

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const signup = async (email, password, age, country) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);

    const isAdded = await addUser(
      email,
      age,
      country,
      user.user.displayName ?? "test",
      user.user.uid
    );

    if (!isAdded) {
      throw new Error("Please try again later! Failed to add the user.", 500);
    }

    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(errorMessage, errorCode);
  }
};

export const signin = async (email, password) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    // console.log(user);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    throw new Error(errorMessage, errorCode);
  }
};

export const signout = async () => {
  // await signOut(auth)
  const auth = getAuth();
  await signOut(auth);
  console.log("LOGINING OUT>>>");
};

export const uploadFile = (file) => {
  const storageRef = ref(storage, "songs/" + file.name);
  try {
    const snapshot = uploadBytesResumable(storageRef, file);

    if (snapshot) {
      console.log("FINISHED UPLOADING THE FILE", snapshot);
      return snapshot;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload the file.");
  }
};

export const storeUserRelatedSong = async (taskName, ref) => {
  const auth = getAuth();

  const song = {
    uid: auth.currentUser.uid,
    display_name: auth.currentUser.displayName,
    original_name: taskName,
    modified_name: taskName,
    genre: "",
    comment_count: 0,
    url: "",
  };

  const url = await getDownloadURL(ref);

  song.url = url;

  console.log(song);

  await addDoc(collection(db, "songs"), song);
};

// Auth.signup(email, password)
// Auth.signin(email, password)
// new Auth(email, password).signup().signin().signout()
