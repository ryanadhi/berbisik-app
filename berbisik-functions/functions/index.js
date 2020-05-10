const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");

const cors = require("cors");
app.use(cors());

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
    return db
      .doc(`/whispers/${snapshot.data().whisperId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userCreated !== snapshot.data().userCreated
        ) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnlike = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("asia-northeast1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/whispers/${snapshot.data().whisperId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userCreated !== snapshot.data().userCreated
        ) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("asia-northeast1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection("whispers")
        .where("userCreated", "==", change.before.data().username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const whisper = db.doc(`/whispers/${doc.id}`);
            batch.update(whisper, {
              userCreatedImage: change.after.data().imageUrl,
            });
          });
          return batch.commit();
        })
        .catch((err) => {
          console.error(err);
        });
    } else return true;
  });

exports.onWhisperDelete = functions
  .region("asia-northeast1")
  .firestore.document("/whispers/{whisperId}")
  .onDelete((snapshot, context) => {
    const whisperId = context.params.whisperId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("whisperId", "==", whisperId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("whisperId", "==", whisperId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("whisperId", "==", whisperId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
