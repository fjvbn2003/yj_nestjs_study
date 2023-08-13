const express = require("express");
const path = require("path");
const { default: mongoose } = require("mongoose");
const passport = require("passport");
const config = require("config");
const serverConfig = config.get("server");
const cookieSession = require("cookie-session");
const usersRouter = require("./routes/users.router");
const mainRouter = require("./routes/main.router");
require("dotenv").config();

const app = express();
const cookieEncryptionKey = process.env.COOKIE_ENCRYPTION_KEY;
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
app.use("/", mainRouter);
app.use("/auth", usersRouter);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/static", express.static(path.join(__dirname, "public")));

const port = serverConfig.port;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
