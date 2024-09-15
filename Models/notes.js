const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 5,
      max: 50,
    },
    discription: {
      type: String,
      required: true,
      min: 10,
      max: 200,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const notesModel = mongoose.model("notes", notesSchema);
module.exports = notesModel;
