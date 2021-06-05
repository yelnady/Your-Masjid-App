import * as firebase from "firebase";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
//Add your Firebase Config here
const  firebaseConfig = {
  apiKey: "AIzaSyCaD5Ivyx9CsvcGiZI7Hpr8h1mcdYgbaVU",
  authDomain: "asdasd-bd29b.firebaseapp.com",
  databaseURL: "https://asdasd-bd29b.firebaseio.com",
  projectId: "asdasd-bd29b",
  storageBucket: "asdasd-bd29b.appspot.com",
  messagingSenderId: "827716967212",
  appId: "1:827716967212:web:63cf6d555de331321f6a89",
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.auth().signInAnonymously();
export const firebaseAuth = firebaseApp.auth();
export const db = firebaseApp.database();
