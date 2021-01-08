// pull in firebase utility library at /app, included when we install the dependency
import firebase from 'firebase/app';
// specifically need only auth and storage so we import only those, leaving out the rest as they are large
import 'firebase/firestore';
import 'firebase/auth';

// object from firebase config SDK wtih API key
const config = {
  apiKey: 'AIzaSyBFxgCy1eiMw64o5jAcDmNqtuVgE8gIw5U',
  authDomain: 'crwn-db-f0927.firebaseapp.com',
  projectId: 'crwn-db-f0927',
  storageBucket: 'crwn-db-f0927.appspot.com',
  messagingSenderId: '170815735376',
  appId: '1:170815735376:web:42c3ad77a8c6db035bf355',
  measurementId: 'G-24GRRBM1KR',
};

// make async API request
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  // if there is a user, query firestore for that user's document
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const userSnapshot = await userRef.get();

  // if the snapshot document does not exist, create piece of data using user ref
  if (!userSnapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    // async request to store data - make object including data from userAuth object and other add'l data
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  // return userRef object if we need it for something else
  return userRef;
};

// initialize firebase using the above config object
firebase.initializeApp(config);

// export auth & firestore method from firebase so we can use elsewhere in app
export const auth = firebase.auth();
export const firestore = firebase.firestore();

// set up Google authentication utility
const provider = new firebase.auth.GoogleAuthProvider();
// set custom parameter to always trigger Google pop-up whenever we use the GoogleAuthProvider for auth and sign-in
provider.setCustomParameters({ prompt: 'select_account' });
// function to call signInWithPopup from auth with provider class above, specifically for Google
export const signInWithGoogle = () => auth.signInWithPopup(provider);

// export all of firebase in case we want the whole library
export default firebase;
