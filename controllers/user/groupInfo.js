
const groupsTable = require("../../model/group");

const user = require("../../model/user");



const GetGrpInfo = async (req, res, next) => {
    try {
      const groupDetails = await groupsTable.findOne({
        where: {
          id: req.query.groupId,
        },
        include: [
          {
            model: user,
            attributes: ["name", "mobile"],
          },
        ],
      });
  
      return res.status(200).json(groupDetails);
    } catch (err) {
      return res.status(400).json(err);
    }
  };
  module.exports=GetGrpInfo;