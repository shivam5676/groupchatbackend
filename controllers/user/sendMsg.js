

const messageTable = require("../../model/message");


const SendMsg = async (req, res, next) => {
  const user = req.body;
  const groupId = req.query.groupid;
  
  try {
    const data = messageTable.create({
      userId: req.user.id,
      text: user.messageData,
      GroupId: groupId,
    });
    return res
      .status(200)
      .json({ msg: "msg sent successfully", status: "success" });
  } catch (err) {
    return res.status(200).json({ msg: "msg failed", status: "failed" });
  }
};
module.exports= SendMsg;
