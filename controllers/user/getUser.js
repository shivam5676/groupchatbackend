
const groupMember = require("../../model/groupMember");
const user = require("../../model/user");



const GetUSer = async (req, res, next) => {
    const requestedgroup = req.query.groupid;
    
    const AllMember = await groupMember.findAll({
      where: {
        groupId: requestedgroup,
      },
      attributes: ["isAdmin", "userId"],
    });
    const promises = AllMember.map(async (current) => {
      const usersdata = await user.findOne({
        where: {
          id: current.userId,
        },
        attributes: ["name", "mobile","profileImage"],
      });
  
      const concatarray = { ...current.dataValues, usersdata };
      return concatarray;
    });
    Promise.all(promises)
      .then((result) => {
        return res.status(201).json(result);
      })
      .catch((err) => res.status(400).json({ msg: err, status: "failed" }));
  };
  module.exports=GetUSer;