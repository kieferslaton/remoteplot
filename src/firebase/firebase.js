import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/analytics'


var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API, 
    authDomain: "remoteplot.firebaseapp.com",
    databaseURL: "https://remoteplot.firebaseio.com",
    projectId: "remoteplot",
    storageBucket: "remoteplot.appspot.com",
    messagingSenderId: "243562274593",
    appId: "1:243562274593:web:3b50add34898f63382e860",
    measurementId: "G-ZJMF8SHBPP"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const storage = firebase.storage()

export { storage, firebase as default} 

