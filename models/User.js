const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 32,
    },
    role: {
      type: Number,
      default: 0,
    },
    password: String,
  },
  { timeStamps: true }
);

module.exports = mongoose.model("User", userSchema);
