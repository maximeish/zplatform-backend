const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reg_date: {
    type: Date,
    default: Date.now,
  },
  email_verified: { type: Boolean, default: false },
});

module.exports = User = mongoose.model("users", UserSchema);
