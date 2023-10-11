// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA3GcGoMIRa0vXYrSMf97PK9wRbkso2LsM',
  authDomain: 'teendo-lista.firebaseapp.com',
  projectId: 'teendo-lista',
  storageBucket: 'teendo-lista.appspot.com',
  messagingSenderId: '1083242059845',
  appId: '1:1083242059845:web:144dba89c6bdc1f13ceb2c',
};

// Initialize Firebase
const app = getApps().length ? getApp : initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth };
