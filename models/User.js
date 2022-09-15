const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  photo_url: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  nationality: {
    type: String,
    required: false,
  },
  marital_status: {
    type: String,
    required: false,
  },
  birthdate: {
    type: String,
    required: false,
  },
  reg_date: {
    type: Date,
    default: Date.now,
  },
  id_photo_url: {
    type: String,
    required: false,
  },
  id_number: {
    type: String,
    required: false,
  },
  email_verified: { type: Boolean, default: false },
  account_status: { type: String, default: "UNVERIFIED" },
});

module.exports = User = mongoose.model("users", UserSchema);
