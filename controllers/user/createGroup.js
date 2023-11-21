
const groupsTable = require("../../model/group");
const groupMember = require("../../model/groupMember");

const CreateGroup = async (req, res, next) => {
    const groupName = req.body.grpname;
    try {
      const respo = await groupsTable.create({
        groupName: groupName,
        superAdmin: req.user.id,
      });
      await groupMember.create({
        userId: req.user.id,
        GroupId: respo.id,
        isAdmin: true,
      });
      return res
        .status(200)
        .json({ msg: "group created successfully", status: "success" });
    } catch (err) {
      return res.status(400).json({
        msg: "group not created successfully",
        status: "failed",
        err: err,
      });
    }
  };
  module.exports= CreateGroup;