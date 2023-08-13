const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Html form의 데이터를 가져오기 위해서 필요.
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
const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
