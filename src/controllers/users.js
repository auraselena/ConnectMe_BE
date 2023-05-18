// const UsersModel = require("../models/users");
// const sequelize = require("sequelize");
const { db } = require("../config");
const { hashPassword, createToken } = require("../config/encript");
const bcrypt = require("bcrypt");
const { transport } = require("../config/nodemailer");

module.exports = {
  getData: (req, res) => {
    let scriptQuery = `Select * from users;`;
    if (req.query.username) {
      scriptQuery = `Select * from users where username: ${db.escape(req.query.username)};`;
    }
    db.query(scriptQuery, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  },
  login: (req, res) => {
    // let scriptQuery = `Select * from users;`;
    // if (req.query.username) {
    // let data = db.query(`Select id, username, email, password from users where username=${db.escape(req.body.mix)} or email=${db.escape(req.body.mix)};`);
    // console.log("cek mix: ", data);
    db.query(`Select * from users where username=${db.escape(req.body.mix)} or email=${db.escape(req.body.mix)};`, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // res.status(200).send(result);
        const cek = bcrypt.compareSync(req.body.password, result[0].password);
        console.log(cek);
        if (cek) {
          let token = createToken({ ...result[0] });
          return res.status(200).send({ success: true, message: "Login success", value: { ...result[0], token } });
        } else {
          return res.status(200).send({
            success: false,
            message: "Your password is wrong",
          });
        }
      }
    });
  },
  register: (req, res) => {
    let { username, email, password, inputPassword } = req.body;
    db.query(`SELECT * from users where username=${db.escape(username)} or email=${db.escape(email)}`, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        return res.status(200).send({ success: false, message: "Username or e-mail has already exist." });
      } else {
        if (password !== inputPassword) {
          res.status(200).send({ success: false, message: "Password doesn't match" });
        } else {
          let newPassword = hashPassword(password);
          let insertQuery = `INSERT INTO users (username, email, password) VALUES (${db.escape(username)}, ${db.escape(email)}, ${db.escape(newPassword)});`;
          db.query(insertQuery, (err, result) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              let token = createToken({
                id: result.insertId,
                username,
                email,
              });
              transport.sendMail(
                {
                  from: "ConnectMe!",
                  to: email,
                  subject: "Verify your email",
                  html: `
                  <div>
                    <h3>Click the link below to verify your email</h3>
                    <a href="http://localhost:3000/verification?t=${token}">Verify Now</a>
                  </div>`,
                },
                (err, info) => {
                  if (err) {
                    return res.status(500).send(err);
                  } else {
                    return res.status(200).send({ success: true, message: "Register success", info });
                  }
                }
              );
            }
          });
        }
      }
    });
  },
  keepLogin: (req, res) => {
    db.query(`SELECT * FROM users WHERE id=${db.escape(req.decript.id)}`, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      let token = createToken({ ...result[0] });
      return res.status(200).send({ ...result[0], token });
    });
  },
  verifiedAccount: (req, res) => {
    db.query(`UPDATE users SET status="verified" WHERE id=${db.escape(req.decript.id)}`, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: err });
      } else {
        return res.status(200).send({ success: true, message: "Verification success" });
      }
    });
  },
  confirmation: (req, res) => {
    db.query(`SELECT id, username, email from users WHERE username=${db.escape(req.body.username)} or email=${db.escape(req.body.email)};`, (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: err });
      } else {
        let token = createToken({
          id: result[0].id,
          username: result[0].username,
          email: result[0].email,
        });
        transport.sendMail(
          {
            from: "ConnectMe!",
            to: result[0].email,
            subject: "Confirm it's you who want to reset your password.",
            html: `
            <div>
            <h3>Click the link below to reset your password.</h3>
            <a href="http://localhost:3000/inputpassword?t=${token}">Reset password</a>
            </div>`,
          },
          (err, info) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              return res.status(200).send({ success: true, message: "Check your email", info });
            }
          }
        );
      }
    });
  },
  inputPassword: (req, res) => {
    let { resetPassword, inputResetPassword } = req.body;
    if (resetPassword !== inputResetPassword) {
      res.status(200).send({ success: false, message: "Password doesn't match" });
    } else {
      let newPassword = hashPassword(resetPassword);
      db.query(`UPDATE users SET password=${db.escape(newPassword)} WHERE id=${db.escape(req.decript.id)};`, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send({ success: true, message: "Reset password success!" });
      });
    }
  },
  editProfile: (req, res) => {
    let { username, password, fullname, bio } = JSON.parse(req.body.data);
    let newPassword = hashPassword(password);
    let updateQuery = `UPDATE users set username=${db.escape(username)}, password=${db.escape(newPassword)}, fullname=${db.escape(fullname)}, bio=${db.escape(bio)}, pfp='/imgProfile/${req.files[0].filename}' where id=${db.escape(
      req.decript.id
    )};`;

    db.query(updateQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send({ success: true, message: "Edit profile success!" });
    });
  },
  verifyAgain: (req, res) => {
    db.query(`SELECT id, username, email from users WHERE id=${db.escape(req.decript.id)}`, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      let token = createToken({
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
      });
      transport.sendMail(
        {
          from: "ConnectMe!",
          to: result[0].email,
          subject: "Verify your email",
          html: `
          <div>
            <h3>Click the link below to verify your email</h3>
            <a href="http://localhost:3000/verification?t=${token}">Verify Now</a>
          </div>`,
        },
        (err, info) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            return res.status(200).send({ success: true, message: "Check your email", info });
          }
        }
      );
    });
  },
};
