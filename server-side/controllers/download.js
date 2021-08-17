const Image = require("../models/Image").Image;
const User = require("../models/User").User;
const path = require("path");
const serverSocket = require("../socket").socketServer;

exports.increaseDownloadCount = async function (req, res, next) {
 let image;
 if (req.body.imageID) {
  image = await Image.findById(req.body.imageID);
 }
 if (!image) {
  const error = new Error("Invalid input from user or Image doesnt exist anymore !");
  error.statusCode = 422;
  throw error;
 }
 image.downloadCounts += 1;
 const savedImage = await image.save();
 // let imagePath = path.join(__dirname, image.imageUrl);
 // imagePath = imagePath.replace("\\", "/");

 //haizz download i dont want to force user login so req.userID doesnt exist instead use image.creator
 const user = await User.findById(image.creator);

 const io = await serverSocket.getIO();
 await io.emit("modification", { action: "increaseDownloadCount", updatedImage: { ...savedImage._doc, _id: savedImage._id.toString(), createdAt: savedImage.createdAt.toISOString(), updatedAt: savedImage.updatedAt.toISOString(), creator: user } });

 //cuz _dirname current is not same level with foler image
 res.download(path.join(__dirname, "..", image.imageUrl));
}