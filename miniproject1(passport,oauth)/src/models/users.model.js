const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //bcrypt compare 비교
  // plain passord = > clioent, this.password => 데이터베이스에 있는 비밀번호
  console.log("hihihih");
  if (plainPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  return cb({ error: "password error" });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
