

const messageTable = require("../../model/message");
const { Op } = require("sequelize");

const groupMember = require("../../model/groupMember");
const user = require("../../model/user");

const GetMsg = async (req, res, next) => {
    const userid = req.user.id;
    const groupId = req.query.groupid; //handle if undefined
    const lastMsgId = req.query.lastmsgId;
    let whereclause = {
      GroupId: groupId,
      id: {
        [Op.gt]: lastMsgId,
      },
    };
    if (!lastMsgId) {
      whereclause = {
        GroupId: groupId,
      };
    }
  
    try {
      const userIsPresent = groupMember.findOne({
        where: {
          userId: userid,
          GroupId: groupId,
        },
      });
      if (userIsPresent) {
        const messages = await messageTable.findAll({
          where: whereclause,
          // where: {
          //   GroupId: groupId,
          // },
          include: [
            {
              model: user,
            },
          ],
  
          attributes: ["id", "text", "GroupId", "createdAt"],
          // order: [['createdAt', 'DESC']], // Order the messages by createdAt in descending order
        });
  
        const messagesWithUserDetails = messages.map((messageTable) => ({
          messageid: messageTable.id,
          text: messageTable.text,
          createdAt: messageTable.createdAt,
          groupId: messageTable.GroupId,
  
          user: {
            id: messageTable.user.dataValues.id,
            name: messageTable.user.dataValues.name,
            mobile: messageTable.user.dataValues.mobile,
          },
        }));
  
        return res.status(200).json(messagesWithUserDetails);
      }
      return res
        .status(400)
        .json({ msg: "You are not a user of this group", status: "failed" });
    } catch (err) {
      return res.status(401).json({ msg: err, status: "failed" });
    }
  };
  module.exports=GetMsg;