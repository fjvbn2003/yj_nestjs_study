const express = require("express");
const path = require("path");
const { default: mongoose } = require("mongoose");
const User = require("./models/users.model");
const passport = require("passport");
const cookieSession = require("cookie-session");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./middlewares/auth");

const app = express();
const cookieEncryptionKey = "supersecret-key";
app.use(
  cookieSession({
    name: "cookie-session-name",
    keys: [cookieEncryptionKey],
  })
);
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Html form의 데이터를 가져오기 위해서 필요.

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://fjvbn2003:qwer1234@yj-nestjs-study.ggiizxj.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index");
});
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});
app.post("/login", (req, res, next) => {
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

app.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup");
});

app.post("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
app.post("/signup", async (req, res) => {
  // user 객체를 생성
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
});
const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
