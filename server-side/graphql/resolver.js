
const User = require("../models/User").User;
const Image = require("../models/Image").Image;
const validator = require("validator");
const bscrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//websocket
const socketServer = require("../socket").socketServer;

const clearImage = require("../utils/file").clearImage;

const throwError = (message, statusCode) => {
 const error = new Error(message);
 error.statusCode = statusCode;//error only has statusCode prop but if u use it clientSide get status prop not statusCode ??
 throw error;
}

//cant use this anymore to clean code because of dumb GRAPHQL =.=
// const getAllImages = (images) => {
//  // if (images.length > 0) {

//  //  images = 
//  //  console.log("DEAD", images, "WHAT");
//  // }
//  const result = images.map(
//   image => {
//    return {
//     ...image._doc, _id: image._id.toString(), createdAt: image.createdAt.toISOString(),
//     updatedAt: image.updatedAt.toISOString()
//    };
//   }
//  );
//  return result;
// }

exports.graphqlResolver = {
 signup: async function ({ userInput }, req) {
  const { email, password, name } = userInput;
  const errors = [];
  if (!validator.isEmail(email) || !validator.isLength(email, 5)) {
   errors.push({ message: "Invalid Email! Length must be >=5" });
  }
  if (!validator.isLength(name, 5)) {
   errors.push({ message: "Name is too short.Length must be >= 5" });
  }
  if (!validator.isLength(password, 5)) {
   errors.push({ message: "Password is too short.Length must be >= 5" });
  }
  if (errors.length > 0) {
   const error = new Error("Invalid user input");
   error.statusCode = 422;
   error.data = errors;
   throw error;
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
   throwError("Email is existed.Please choose another", 422);
  }
  const hashPassword = await bscrypt.hash(password, 12);
  const newUser = new User(
   {
    email,
    password: hashPassword,
    name
   }
  );
  const savedUser = await newUser.save();
  return { ...savedUser._doc, _id: savedUser._id.toString() };
 },

 signin: async function ({ email, password }, req) {
  let isAuthenticated = false;
  const user = await User.findOne({ email });
  if (user) {
   const isEqual = await bscrypt.compare(password, user.password);
   if (isEqual) {
    isAuthenticated = true;
   }
  }
  if (!isAuthenticated) {
   throwError("Email or password is not correct!", 422);
  }
  const token = jwt.sign(
   {
    userID: user._id.toString()
   },
   "secretkey",
   {
    expiresIn: "1h"
   }
  )
  return { token, userID: user._id.toString() };
 },

 postImage: async function ({ imageInput }, req) {
  let { imageUrl } = imageInput;
  if (!req.isAuth) {
   const error = new Error("Unauthenticated.Please sigin firstly!");
   error.statusCode = 401;
   throw error;
  }
  //suc vat  i let multer solve why i use it
  // if (validator.isEmpty(imageUrl)) {
  //  errors.push({ message: "ImageUrl cant be null" });
  // }
  // if (errors.length > 0) {
  //  const error = new Error("Invalid user input");
  //  error.statusCode = 422;
  //  error.data = errors;
  //  throw error;
  // }
  const user = await User.findById(req.userID);
  if (!user) {
   throwError("Invalid User", 401);
  }
  const image = new Image({
   imageUrl, creator: user
  });
  const savedImage = await image.save();
  user.images.push(savedImage);
  await user.save();
  const io = await socketServer.getIO();
  await io.emit("modification", { action: "posted", image: { ...savedImage._doc, _id: savedImage._id.toString(), createdAt: savedImage.createdAt.toISOString(), updatedAt: savedImage.updatedAt.toISOString(), creator: user } });
  //i scare dumb graphql so i cant dare to refractor code .GraphQL DUMBASS =.=
  return { ...savedImage._doc, _id: savedImage._id.toString(), createdAt: savedImage.createdAt.toISOString(), updatedAt: savedImage.updatedAt.toISOString(), creator: user };
 },

 getImages: async function (arg, req) {
  let images = await Image.find().sort({ creadtedAt: -1 }).populate("creator");
  if (!images) {
   throwError("Something went wrong!");
  }
  // getAllImages(images);
  const result = images.map(
   image => {
    return {
     ...image._doc, _id: image._id.toString(), createdAt: image.createdAt.toISOString(),
     updatedAt: image.updatedAt.toISOString()
    };
   }
  );
  return result;
 },

 getOwnImages: async function ({ userID }, req) {
  if (!req.isAuth) {
   throwError("Unauthenticated", 401);
  }
  let images = await Image.find({ creator: req.userID }).sort({ creadtedAt: -1 });
  if (!images) {
   throwError("Something went wrong!");
  }
  const result = images.map(
   image => {
    return {
     ...image._doc, _id: image._id.toString(), createdAt: image.createdAt.toISOString(),
     updatedAt: image.updatedAt.toISOString(), creator: { ...image.creator, _id: req.userID }
    };
   }
  );
  return result;
 },

 deleteImage: async function ({ imageID }, req) {
  if (!req.isAuth) {
   throwError("Unauthenticated", 403);
  }
  const image = await Image.findById(imageID);
  if (!image) {
   throwError("Something went wrong!");
  }
  if (req.userID !== image.creator.toString()) {
   throwError("Unauthorized. You dont have permission to do this!", 403);
  }
  const user = await User.findById(req.userID);
  if (!user) {
   throwError("Invalid user", 403);
  }
  user.images = user.images.filter(element => {
   return element._id.toString() !== imageID;
  });
  await user.save();
  await Image.findByIdAndDelete(imageID);
  clearImage(image.imageUrl);
  const io = await socketServer.getIO();
  await io.emit("modification", { action: "deleted", imageID });
  return true;
 },
}