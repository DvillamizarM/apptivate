
import  firebase from 'firebase/app'
import 'firebase/firestore'
import "firebase/auth"

var firebaseConfig = {
  apiKey: "AIzaSyAcKmCl43xQgwY-QTiyDLzFKWwI-hm1o_w",
  authDomain: "rehabilitacion-420dc.firebaseapp.com",
  projectId: "rehabilitacion-420dc",
  storageBucket: "rehabilitacion-420dc.appspot.com",
  messagingSenderId: "1013647865976",
  appId: "1:1013647865976:web:0d0240f0699a2b341dd58d",
  measurementId: "G-ZL158SGFTX",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

const db = firebase.firestore();
const auth = firebase.auth();
// db.enablePersistence();
// firebase.firestore().settings({
//   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
// });
export default {
  firebase,
  db,
  auth
};
