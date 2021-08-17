const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
 {
  email: {
   type: String,
   requrired: true
  },
  password: {
   type: String,
   required: true
  },
  name: {
   type: String,
   required: true
  },
  images: [
   {
    type: Schema.Types.ObjectId,
    ref: "Image"
   }
  ]
 }, {
 timestamps: true
}
);

exports.User = mongoose.model("User", User);