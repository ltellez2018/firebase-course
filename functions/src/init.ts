
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  databaseURL: "https://fir-course-1194e.firebaseio.com"
});

export const db = admin.firestore();



