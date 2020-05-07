const functions = require("firebase-functions");
const app = require("express")();

const {
  getAllWhispers,
  postOneWhisper,
  getWhisper,
  commentOnWhisper,
} = require("./routes/whisper");
const {
  signup,
  login,
  uploadImage,
  addUserDetail,
  getAuthenticatedUser,
} = require("./routes/user");
const firebaseAuth = require("./util/firebaseAuth");

// Whisper routes
app.get("/whispers", getAllWhispers); // Get all whispers
app.post("/whispers", firebaseAuth, postOneWhisper); // Post one whisper
app.get("/whispers/:whisperId", getWhisper); // Get one whisper
app.post("/whispers/:whisperId/comment", firebaseAuth, commentOnWhisper); // Post a comment
// TODO
// delete whisper
// like whisper
// unlike whisper

// User routes
app.post("/signup", signup); // Signup
app.post("/login", login); // Login
app.post("/users/image", firebaseAuth, uploadImage); // Upload photo
app.post("/users", firebaseAuth, addUserDetail); // Add user details
app.get("/users", firebaseAuth, getAuthenticatedUser); // Get user details

exports.api = functions.region("asia-northeast1").https.onRequest(app);
