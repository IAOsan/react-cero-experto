// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBCtOrTTW1Hu2hC9sL9h18kMj1FzSCrqZA',
	authDomain: 'react-apps-1eb05.firebaseapp.com',
	projectId: 'react-apps-1eb05',
	storageBucket: 'react-apps-1eb05.appspot.com',
	messagingSenderId: '845757100925',
	appId: '1:845757100925:web:84146381b329ccc48a5214',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth(app);
const db = firestore.getFirestore();

export { firebaseAuth, firestore, db, auth };
