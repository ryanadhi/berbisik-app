const functions = require("firebase-functions");
const app = require("express")();

const { getAllWhispers, postOneWhisper } = require("./routes/whisper");
const { signup, login } = require("./routes/user");
const firebaseAuth = require("./util/firebaseAuth");

// Whisper routes
app.get("/whispers", getAllWhispers); // Get all whispers
app.post("/whispers", firebaseAuth, postOneWhisper); // Post one whisper

// User routes
app.post("/signup", signup); // Signup
app.post("/login", login); // Login

exports.api = functions.region("asia-northeast1").https.onRequest(app);
