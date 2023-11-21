
const groupsTable = require("../../model/group");
const groupMember = require("../../model/groupMember");



const FetchGroup = async (req, res, next) => {
    const groupuserId = req.user.id;
    try {
      const response = await groupMember.findAll({
        where: {
          userId: groupuserId,
        },
      });
      const promises = response.map((current) => {
        return groupsTable.findAll({
          where: {
            id: current.GroupId,
          },
        });
      });
  
      Promise.all(promises)
        .then((results) => {
          return res.status(200).json(results);
        })
        .catch((err) => {
          return res.status(400).json(err);
        });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  module.exports= FetchGroup