const passport = require("passport");
const User = require("../models/users.model");

const LocalStratege = require("passport-local").Strategy;

// req.login(user)

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  "local",
  new LocalStratege(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      User.findOne({
        email: email.toLocaleLowerCase(),
      })
        .then((user) => {
          // console.log("user", user);
          // console.log("email, password", email, password);
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found` });
          }
          user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false, { msg: "invalid email of password" });
          });
        })
        .catch((err) => {
          return done(null, false, { msg: err });
        });
    }
  )
);
