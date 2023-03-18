import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  limit,
  orderBy,
  startAfter,
  where,
  getDoc,
} from "firebase/firestore";
// prettier-ignore
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,} from "firebase/auth";

import {
  deleteObject,
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

export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage();

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

export const deleteSong = async (song) => {
  const storageRef = ref(storage, "songs/" + song.original_name);
  const songDocRef = doc(db, "songs", song.docId);

  try {
    await deleteObject(storageRef);
    await deleteDoc(songDocRef);
    return song;
  } catch (e) {
    console.log("ERROR", e);
    console.error(e);
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

/**
 * @description Get all the songs from the users db
 * @return Array<Object> songs
 */
export const getSongs = async (_limit) => {
  try {
    const songs = [];

    const docRef = collection(db, "songs");

    let docSnapshots = await getDocs(docRef); // gets all the songs

    if (limit) {
      const lastDoc = docSnapshots.docs[docSnapshots.docs.length - 1]; // gets the last visible song

      const q = query(docRef, orderBy("modified_name"), limit(_limit));

      docSnapshots = await getDocs(q); // if there is a limit, then it modifies the query to include the limit and skipping.
    }

    docSnapshots.docs.forEach((doc) =>
      songs.push({ ...doc.data(), docId: doc.id })
    );

    return songs;
  } catch (error) {
    console.log(error);
    console.log("ERROR");
  }
};

export const getSong = async (id) => {
  try {
    const songRef = doc(db, "songs", id);
    const song = await getDoc(songRef);
    console.log("SONG FOUND", song.data());
    return song.exists() ? song.data() : {};
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const addComment = async (comment) => {
  try {
    const _ref = await collection(db, "comments");
    await addDoc(_ref, {
      ...comment,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
