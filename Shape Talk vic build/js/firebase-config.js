// Firebase Configuration for ShapeTalk
// Replace these values with your own Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyA_LcS6Pwcudvmjcc8P7Qa0hnss5cUCULw",
  authDomain: "shapetalk-25a1a.firebaseapp.com",
  databaseURL: "https://shapetalk-25a1a-default-rtdb.firebaseio.com",
  projectId: "shapetalk-25a1a",
  storageBucket: "shapetalk-25a1a.firebasestorage.app",
  messagingSenderId: "912770682770",
  appId: "1:912770682770:web:25d271bcf252254410fb4b"
};

// Initialize Firebase
let firebaseApp, database;

function hasValidFirebaseConfig() {
    return Object.values(firebaseConfig).every((value) => typeof value === 'string' && value && !value.includes('YOUR_'));
}

function initFirebase() {
    if (typeof firebase === 'undefined' || !hasValidFirebaseConfig()) {
        return false;
    }

    if (database) {
        return true;
    }

    try {
        firebaseApp = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Export for use in other files
window.FirebaseConfig = {
    hasValidConfig: hasValidFirebaseConfig,
    init: initFirebase,
    getDatabase: () => database
};
