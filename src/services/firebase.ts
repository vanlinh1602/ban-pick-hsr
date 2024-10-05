import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import firebaseConfig from '../configs/firebase.json';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
