const { db } = require("../util/admin");

// Get all whispers
exports.getAllWhispers = (req, res) => {
  db.collection("whispers")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let whispers = [];
      data.forEach((doc) => {
        whispers.push({
          whisperId: doc.id,
          body: doc.data().body,
          userCreated: doc.data().userCreated,
          createdAt: doc.data().createdAt,
        });
      });
      return res.status(200).json(whispers);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "internal server error" });
    });
};

// Post one whisper
exports.postOneWhisper = (req, res) => {
  const newWhisper = {
    body: req.body.body,
    userCreated: req.user.username,
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
};

// Get one whisper
exports.getWhisper = (req, res) => {
  let whisperData = {};
  db.doc(`/whispers/${req.params.whisperId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Whisper not found" });
      }
      whisperData = doc.data();
      whisperData.whisperId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("whisperId", "==", req.params.whisperId)
        .get()
        .then((data) => {
          whisperData.comments = [];
          data.forEach((doc) => {
            whisperData.comments.push(doc.data());
          });
          return res.status(200).json(whisperData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "internal server error" });
        });
    });
};

// Comment on a whisper
exports.commentOnWhisper = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ error: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    whisperId: req.params.whisperId,
    userCreated: req.user.username,
    userCreatedImage: req.user.imageUrl,
  };

  db.doc(`/whispers/${req.params.whisperId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Whisper not found" });
      }
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      return res.status(201).json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};
