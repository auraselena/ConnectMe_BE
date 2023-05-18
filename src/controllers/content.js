const { db } = require("../config");

module.exports = {
  addContent: (req, res) => {
    let { caption, username, pfp } = JSON.parse(req.body.data);
    let insertQuery = `INSERT INTO content (username, caption, image, pfp) VALUES (${db.escape(username)}, ${db.escape(caption)}, '/imgContent/${req.files[0].filename}', ${db.escape(pfp)});`;
    db.query(insertQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ success: true, message: "Add content success!" });
    });
  },
  getContent: (req, res) => {
    let selectQuery = `SELECT * from content WHERE username=${db.escape(req.query.username)};`;
    db.query(selectQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  },
  getAllContent: (req, res) => {
    let selectQuery = `SELECT * from content;`;
    db.query(selectQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(result);
    });
  },
};
