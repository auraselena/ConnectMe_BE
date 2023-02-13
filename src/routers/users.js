const { Router } = require("express");
const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.get("/", usersController.getData);
route.post("/login", usersController.login);
route.post("/register", usersController.register);
route.get("/keepLogin", readToken, usersController.keepLogin);
route.patch("/verified", readToken, usersController.verifiedAccount);
route.post("/confirmation", usersController.confirmation);
route.patch("/inputPassword", readToken, usersController.inputPassword);
route.patch("/editProfile", readToken, uploader("/imgProfile", "IMGPROFILE").array("images", 1), usersController.editProfile);
route.patch("/verifyAgain", readToken, usersController.verifyAgain);

module.exports = route;
