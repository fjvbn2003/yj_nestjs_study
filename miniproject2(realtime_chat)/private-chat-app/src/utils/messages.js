const messageModel = require("../models/messages.model");

const getToken = (sender, receiver) => {
  let key = [sender, receiver].sort().join("_");
  return key;
};

const saveMessages = async ({ from, to, message, time }) => {
  let token = getToken(from, to);
  let data = {
    from,
    message,
    time,
  };
  messageModel
    .updateOne(
      { userToken: token },
      {
        $push: { messages: data },
      }
    )
    .then((res) => {
      console.log("메시지가 생성되었습니다.", res);
    })
    .catch((err) => {
      throw err;
    });
};
module.exports = {
  saveMessages,
};
