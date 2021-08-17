const fs = require("fs");
const path = require("path");

//clearImage in server when client removes image
const clearImage = async function (filePath) {
 //replaceAll is not a function(WTF another project i can use but in here i cant WHY?)
 // filePath = filePath.replaceAll("/", "\\"); //i use os window so i must to do this
 filePath = filePath.replace("/", "\\"); //i use os window so i must to do this
 const pathImg = path.join(__dirname, "..", filePath); //filePath already has double backSlash so just need two dot
 await fs.unlink(pathImg, err => {
  if (err) {
   console.log(err);
   throw err;
  }
 });
}

exports.clearImage = clearImage;
