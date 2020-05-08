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
    userCreatedImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("whispers")
    .add(newWhisper)
    .then((doc) => {
      const whisperData = newWhisper;
      whisperData.whisperId = doc.id;
      res.status(201).json(whisperData);
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
          console.error(err);
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
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      return res.status(201).json(newComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Like a whisper
exports.likeWhisper = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userCreated", "==", req.user.username)
    .where("whisperId", "==", req.params.whisperId)
    .limit(1);

  const whisperDocument = db.doc(`/whispers/${req.params.whisperId}`);

  let whisperData;

  whisperDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        whisperData = doc.data();
        whisperData.whisperId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Whisper not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            whisperId: req.params.whisperId,
            userCreated: req.user.username,
            createdAt: new Date().toISOString(),
          })
          .then(() => {
            whisperData.likeCount++;
            return whisperDocument.update({ likeCount: whisperData.likeCount });
          })
          .then(() => {
            return res.status(201).json(whisperData);
          });
      } else {
        return res.status(400).json({ error: "Whisper already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Unlike a whisper
exports.unlikeWhisper = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userCreated", "==", req.user.username)
    .where("whisperId", "==", req.params.whisperId)
    .limit(1);

  const whisperDocument = db.doc(`/whispers/${req.params.whisperId}`);

  let whisperData;

  whisperDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        whisperData = doc.data();
        whisperData.whisperId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Whisper not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Whisper not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            whisperData.likeCount--;
            return whisperDocument.update({ likeCount: whisperData.likeCount });
          })
          .then(() => {
            return res.status(200).json(whisperData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete one whisper
exports.deleteWhisper = (req, res) => {
  const document = db.doc(`/whispers/${req.params.whisperId}`);

  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Whisper not found" });
      }
      if (doc.data().userCreated !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.status(200).json({ message: "Whisper deleted succesfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
