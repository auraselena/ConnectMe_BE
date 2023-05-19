const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    return hashPass;
  },
  createToken: (payload, expired = "24h") => {
    let token = jwt.sign(payload, "socmed", {
      expiresIn: expired,
    });
    return token;
  },
  readToken: (req, res, next) => {
    jwt.verify(req.token, "socmed", (err, decript) => {
      // membaca jwt.sign
      if (err) {
        return res.status(200).send({
          success: false,
          message: "Authenticate token failed",
        });
      }

      req.decript = decript;
      next();
    });
  },
};
