import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBsSp0olLLsuNKDx-Zo8oxh_nk5Eu974Hw",
  authDomain: "react-chatting-app-4d9cb.firebaseapp.com",
  databaseURL: "https://react-chatting-app-4d9cb.firebaseio.com",
  projectId: "react-chatting-app-4d9cb",
  storageBucket: "react-chatting-app-4d9cb.appspot.com",
  messagingSenderId: "151296497852",
  appId: "1:151296497852:web:7f1a33c1e2c4acd6e258b9",
  measurementId: "G-R3SRF5RZF3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
