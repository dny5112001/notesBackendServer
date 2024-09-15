const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 5,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
