const multer = require("multer");

const storage = multer.diskStorage(
 {
  destination: (req, file, callBackFunc) => {
   // callBackFunc(null, "images");//handle to save image to folder images in server
   callBackFunc(null, "images");//handle to save image to folder images in server
  },
  filename: (req, file, callBackFunc) => {//
   callBackFunc(null, file.originalname); // save file name with original name but why n cant be capital??(damn this is too encryptic)
  }
 }
);

const fileFilter = (req, file, callBackFunc) => {
 if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
  callBackFunc(null, true);
 } else {
  callBackFunc(null, false);
 }
};

exports.multerMiddleware = multer({ storage, fileFilter }).single("image")//we pass this param cuz it's a name input type file in client side