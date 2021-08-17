
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema(
 {
  imageUrl: {
   type: String,
   requrired: true
  },
  title: {
   type: String,
   requrired: true
  },
  creator: {
   type: Schema.Types.ObjectId,
   ref: "User"
  },
  downloadCounts: {
   type: Number,
   default: 0
  }
 }, {
 timestamps: true
}
);

exports.Image = mongoose.model("Image", Image);