const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory, filePrefix) => {
    let defaultDir = "./src/public";

    const storageUploader = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDir = directory ? defaultDir + directory : defaultDir;

        if (fs.existsSync(pathDir)) {
          console.log(`Directory ${pathDir} exist`);
          cb(null, pathDir);
        } else {
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

        let newName = filePrefix + Date.now() + "." + ext[ext.length - 1];
        console.log("New file Name", newName);
        cb(null, newName);
      },
    });

    return multer({
      storage: storageUploader,
      fileFilter: (req, file, cb) => {
        const extFilter = /\.(jpg|png|webp|doc|pdf|jpeg)/;
        let check = file.originalname.toLowerCase().match(extFilter);
        if (check) {
          cb(null, true);
        } else {
          cb(new Error(`Your file ext denied`, false));
        }
      },
    });
  },
};