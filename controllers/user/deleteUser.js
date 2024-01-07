
const groupsTable = require("../../model/group");
const groupMember = require("../../model/groupMember");





const DeleteUser = async (req, res, next) => {
    
    try {
      const superAdmin = await groupsTable.findOne({
        where: {
          id: req.query.groupid,
          superAdmin: req.user.id,
        },
      });
      
      if (req.query.userid == superAdmin.superAdmin) {
        return res
          .status(401)
          .json({ msg: "no body can delete superadmin", status: "failed" });
      }
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
          const deletes = await groupMember.destroy({
            where: {
              userId: req.query.userid,
              groupId: req.query.groupid,
            },
          });
          return res
            .status(201)
            .json({ msg: "user deleted successfully", status: "success" });
        } catch (err) {
          return res.status(401).json({ msg: err, status: "failed" });
        }
      } else
        return res
          .status(401)
          .json({ msg: "only admin can delete user", status: "failed" });
    } catch (err) {
      return res.status(401).json({ msg: err });
    }
  };
  module.exports=   DeleteUser