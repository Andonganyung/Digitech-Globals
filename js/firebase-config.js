// ============================================
// FIREBASE CONFIGURATION
// ============================================
// Replace these values with your Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your Apps

const firebaseConfig = {
    apiKey: "AIzaSyAfYPxWDHWtaYP_p788i3xwqz-CCS4Ejbw",
    authDomain: "digitech-globals-academy.firebaseapp.com",
    projectId: "digitech-globals-academy",
    storageBucket: "digitech-globals-academy.firebasestorage.app",
    messagingSenderId: "11645265153",
    appId: "1:11645265153:web:9fe21fe82fed06f6a86700",
    measurementId: "G-0SYDQ68MPF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;

console.log('Firebase initialized successfully');
