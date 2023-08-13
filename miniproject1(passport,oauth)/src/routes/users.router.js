const express = require("express");
const passport = require("passport");
const User = require("../models/users.model");
const sendMail = require("../mail/mail");
const usersRouter = express.Router();

usersRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ msg: info });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
});

usersRouter.post("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
usersRouter.post("/signup", async (req, res) => {
  // user 객체를 생성
  const user = new User(req.body);
  try {
    await user.save();
    // user에게 email 보내기
    sendMail("fjvbn2003@gmail.com", "youngju Kim", "welcome");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
});
usersRouter.get("/google", passport.authenticate("google"));
usersRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);
module.exports = usersRouter;
