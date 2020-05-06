const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://berbisik-app.firebaseio.com",
});

// admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-function
//
exports.helloWorld = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
  });

exports.getWhispers = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    admin
      .firestore()
      .collection("whispers")
      .get()
      .then((data) => {
        let whispers = [];
        data.forEach((doc) => {
          whispers.push(doc.data());
        });
        return res.status(200).json(whispers);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "internal server error" });
      });
  });

exports.createWhisper = functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    if (req.method !== "POST") {
      return res.status(400).json({ error: "Method not allowed" });
    }
    const newWhisper = {
      body: req.body.body,
      userHandle: req.body.userHandle,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

    admin
      .firestore()
      .collection("whispers")
      .add(newWhisper)
      .then((doc) => {
        res
          .status(201)
          .json({ message: `document ${doc.id} created successfully` });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "internal server error" });
      });
  });
