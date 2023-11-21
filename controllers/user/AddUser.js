
const groupsTable = require("../../model/group");
const groupMember = require("../../model/groupMember");





const AddUser = async (req, res, next) => {
    const newUserId = req.query.userId;
    const groupId = req.query.groupId;
    
    try {
      const superAdmin = await groupsTable.findOne({
        where: {
          id: groupId,
          superAdmin: +req.user.id,
        },
      });
      console.log("superAdmin", superAdmin);
      let admin;
      if (!superAdmin) {
        admin = await groupMember.findOne({
          where: {
            userId: req.user.id,
  
            groupId: req.query.groupid,
            isAdmin: true,
          },
        });
      }
      if (superAdmin || admin) {
        try {
          const addeduser = await groupMember.create({
            userId: newUserId,
            GroupId: groupId,
            isAdmin: false,
          });
          return res
            .status(201)
            .json({ msg: "user added successfully", status: "success" });
        } catch (err) {
          return res.status(401).json({
            msg: "there is a problem while adding this user",
            status: "failed",
            err,
          });
        }
      } else
        return res.status(401).json({
          msg: "there is a problem while adding this user",
          status: "failed",
          err,
        });
    } catch (err) {
      return res.status(401).json({
        msg: "you are not admin so u can not add user",
        status: "failed",
        err,
      });
    }
  };
  module.exports=AddUser