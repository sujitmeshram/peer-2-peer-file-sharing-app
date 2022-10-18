//file model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true }, //path for file
    size: { type: Number, required: true },
    uuid: { type: String, required: true }, //generated id for each file
    sender: { type: String, required: false }, // sender email
    receiver: { type: String, required: false }, //receiver email
  },
  { timestamps: true } //"created at" and "updated at" will generate by timestamps
);

module.exports = mongoose.model("File", fileSchema); //ModelName="File"
