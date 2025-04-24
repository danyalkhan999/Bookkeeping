// config/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccountKey.json"); // Path to your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Using service account credentials
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Optional: If using Firebase Storage
});

const bucket = admin.storage().bucket(); // Access Firebase Storage bucket (optional)
const db = admin.firestore(); // Access Firestore (optional)

module.exports = { admin, bucket, db };
