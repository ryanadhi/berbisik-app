const { db } = require("../util/admin");

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
};

exports.postOneWhisper = (req, res) => {
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
};
