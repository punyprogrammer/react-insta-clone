import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyD589E9s4E4guQpAN2l4PX4hFG2GOEmZQA",

  authDomain: "insta-clone-58926.firebaseapp.com",

  projectId: "insta-clone-58926",

  storageBucket: "insta-clone-58926.appspot.com",

  messagingSenderId: "821762354961",

  appId: "1:821762354961:web:de5d0dc3924a7b2dbd26b0",
};

//inititialise firebase
firebase.initializeApp(firebaseConfig);
//initialize services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();
export { projectFirestore, projectAuth, projectStorage };
