const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");

const {
  getAllWhispers,
  postOneWhisper,
  getWhisper,
  commentOnWhisper,
  likeWhisper,
  unlikeWhisper,
  deleteWhisper,
} = require("./routes/whisper");
const {
  signup,
  login,
  uploadImage,
  addUserDetail,
  getAuthenticatedUser,
  getUserDetail,
  markNotificationAsRead,
} = require("./routes/user");
const firebaseAuth = require("./util/firebaseAuth");

// Whisper routes
app.get("/whispers", getAllWhispers); // Get all whispers
app.post("/whispers", firebaseAuth, postOneWhisper); // Post one whisper
app.get("/whispers/:whisperId", getWhisper); // Get one whisper
app.delete("/whispers/:whisperId", firebaseAuth, deleteWhisper); // Delete whisper
app.post("/whispers/:whisperId/comment", firebaseAuth, commentOnWhisper); // Post a comment
app.get("/whispers/:whisperId/like", firebaseAuth, likeWhisper); // Like whisper
app.get("/whispers/:whisperId/unlike", firebaseAuth, unlikeWhisper); // Unlike whisper

// User routes
app.post("/signup", signup); // Signup
app.post("/login", login); // Login
app.post("/users/image", firebaseAuth, uploadImage); // Upload photo
app.post("/users", firebaseAuth, addUserDetail); // Add user details
app.get("/users", firebaseAuth, getAuthenticatedUser); // Get user details
app.get("/users/:username", getUserDetail); // Get user detail public
app.post("/notifications", markNotificationAsRead); // Mark notification as Read

exports.api = functions.region("asia-northeast1").https.onRequest(app);

// Notifications
exports.createNotificationOnLike = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/whispers/${snapshot.data().whisperId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toDateString(),
            recipient: doc.data().userCreated,
            sender: snapshot.data().userCreated,
            type: "like",
            read: false,
            whisperId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("asia-northeast1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`/whispers/${snapshot.data().whisperId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toDateString(),
            recipient: doc.data().userCreated,
            sender: snapshot.data().userCreated,
            type: "comment",
            read: false,
            whisperId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
