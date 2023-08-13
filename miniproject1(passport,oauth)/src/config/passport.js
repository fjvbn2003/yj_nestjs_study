const passport = require("passport");
const User = require("../models/users.model");

const LocalStratege = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// req.login(user)

passport.serializeUser((user, done) => {
  // session 생성
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  // cookie 에서 user 정보 해석
  User.findById(id).then((user) => {
    done(null, user);
  });
});
const localStrategyConfig = new LocalStratege(
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
);
passport.use("local", localStrategyConfig);

const googleClientID =
  "152162374704-0nl5l3d3tvg1qmoj3jca2v40e4vusltk.apps.googleusercontent.com";
const googleClientSecret = "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";

const googleStrategyConfig = new GoogleStrategy(
  {
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "/auth/google/callback",
    scope: ["email", "profile"],
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
      .then((existingUser) => {
        if (existingUser) {
          return done(null, existingUser);
        } else {
          // new user
          const user = new User();
          user.email = profile.emails[0].value;
          user.googleId = profile.id;
          user
            .save()
            .then((user) => {
              done(null, user);
            })
            .catch((err) => {
              console.log(err);
              return done(err);
            });
        }
      })
      .catch((err) => {
        return done(null, false, { msg: err });
      });
  }
);
passport.use("google", googleStrategyConfig);
