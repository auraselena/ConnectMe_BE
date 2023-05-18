const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory, filePrefix) => {
    // step 1. konfigure storage

    // tempat menyimpan file
    let defaultDir = "./src/public";

    // menyimpan file dari FE ke directory BE
    const storageUploader = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDir = directory ? defaultDir + directory : defaultDir;

        // cek apakah direktori yg dituju sudah ada atau belum
        if (fs.existsSync(pathDir)) {
          console.log(`Directory ${pathDir} exist`);
          cb(null, pathDir);
        } else {
          // bikin direktori baru
          fs.mkdir(pathDir, { recursive: true }, (err) => {
            if (err) {
              console.log("Error make directory", err);
            }

            cb(err, pathDir);
          });
        }
      },
      filename: (req, file, cb) => {
        let ext = file.originalname.split(".");
        console.log(ext);

        // membuat name baru untuk file yang diupload (di-rename)
        let newName = filePrefix + Date.now() + "." + ext[ext.length - 1];
        console.log("New file Name", newName);
        cb(null, newName);
      },
    });

    return multer({
      storage: storageUploader,

      // step 2. bikun fungsi untuk filter extension
      fileFilter: (req, file, cb) => {
        const extFilter = /\.(jpg|png|webp|doc|pdf|jpeg)/;
        let check = file.originalname.toLowerCase().match(extFilter);

        // cek apakah extension yg diupload sesuai dengan yg diinginkan
        if (check) {
          cb(null, true);
        } else {
          cb(new Error(`Your file ext denied`, false));
        }
      },
    });
  },
};