const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// TODO: Authentication
// Solution #1: callable function, spread context object and see if admin.
// Pit falls: some god hacker can mutate admin field and bypass check.

// Solution #2: callable function, set customer user claims.
// Pit falls: will require modifying existing admins. UI dashboard will
// need to be created to see admins as there is no way of finding out

// Solution #3: callable function / http REST, database lookup
// Pit falls: will require looking up db everytime might slow in future.
