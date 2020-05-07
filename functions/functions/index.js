const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const app = express();
const firebase = require("firebase");
const serviceAccount = require("./serviceAccountKey.json");

const firebaseConfig = require("./firebaseconfig");

firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://berbisik-app.firebaseio.com",
});

const db = admin.firestore();

// Get whispers
app.get("/whispers", (req, res) => {
  db.collection("whispers")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let whispers = [];
      data.forEach((doc) => {
        whispers.push({
          whisperId: doc.id,
          body: doc.data().body,
          createdBy: doc.data().createdBy,
          createdAt: doc.data().createdAt,
        });
      });
      return res.status(200).json(whispers);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "internal server error" });
    });
});

// Middleware
const firebaseAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.username = data.docs[0].data().username;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
};

// Post new whisper
app.post("/whispers", firebaseAuth, (req, res) => {
  const newWhisper = {
    body: req.body.body,
    createdBy: req.user.username,
    createdAt: new Date().toISOString(),
  };

  db.collection("whispers")
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

// Validation helpers
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

// Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
  };

  // validate input
  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(newUser.password)) {
    errors.password = "Must not be empty";
  } else if (newUser.password.length < 6) {
    errors.password = "Minimum 6 characters";
  }

  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Password must match";
  }

  if (isEmpty(newUser.username)) {
    errors.username = "Must not be empty";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ username: `this username is already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ emai: "Email is already in used" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// Login route
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  // Validate input
  let errors = {};

  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(200).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong password, please try again" });
      } else if (err.code === "auth/user-not-found") {
        return res.status(403).json({ general: "Email is not registered" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.region("asia-northeast1").https.onRequest(app);
