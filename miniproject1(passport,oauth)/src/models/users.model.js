const mongoose = require("mongoose");
const bcrypt = requre("bcrypt");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
