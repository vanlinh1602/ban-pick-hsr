import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAkL6HSOyvLmkfiiWVyYUFYSJ2e_4oiRVg',
  authDomain: 'tournament-c8127.firebaseapp.com',
  projectId: 'tournament-c8127',
  storageBucket: 'tournament-c8127.appspot.com',
  messagingSenderId: '200422573385',
  appId: '1:200422573385:web:af49aa84b1eae55bb5c698',
  measurementId: 'G-YPFR4JGMK5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
