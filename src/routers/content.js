const express = require("express");
const route = express.Router();
const { contentController } = require("../controllers");
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.post("/addContent", uploader("/imgContent", "IMGCONTENT").array("images", 1), contentController.addContent);
route.get("/getContent", contentController.getContent);
route.get("/getAllContent", contentController.getAllContent);

module.exports = route;
