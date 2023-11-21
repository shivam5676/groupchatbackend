
const groupsTable = require("../../model/group");
const groupMember = require("../../model/groupMember");



const MakeAdmin = async (req, res, next) => {
  try {
    const superAdmin = await groupsTable.findOne({
      where: {
        id: req.query.groupid, //req.query.groupid
        superAdmin: req.user.id, //req.user.id
      },
    });
    console.log("superrrr", superAdmin);
    let admin;
    if (!superAdmin) {
      admin = await groupMember.findOne({
        where: {
          userId: req.user.id,
          groupId: req.query.groupid, //req.query.groupid,
          isAdmin: true,
        },
      });
      console.log("adminnn", admin);
    }
    if (superAdmin || admin) {
      try {
        const updateAdmin = await groupMember.update(
          { isAdmin: true },
          {
            where: {
              userId: req.query.userid, //req.query.userid
              groupId: req.query.groupid,
            },
          }
        );
        return res
          .status(201)
          .json({ msg: "user is a admin now", status: "success" });
      } catch (err) {
        return res.status(401).json({
          err: err,
          msg: "only admin can make other admin",
          status: "failed",
        });
      }
    } else
      return res.status(401).json({
        err: err,
        msg: "only admin can make other admin",
        status: "failed",
      });
  } catch (err) {
    return res.status(401).json({ msg: err, status: "failed" });
  }
};
module.exports= MakeAdmin