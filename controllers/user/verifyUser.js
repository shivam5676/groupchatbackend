
const user = require("../../model/user");

const verifyUser = async (req, res, next) => {
    try {
      const verifyUser = await user.findOne({
        where: {
          id: req.user.id,
        },
      });
  
      if (verifyUser) {
        return res.status(200).json({ user: req.user, status: "success" });
      }
      return res.status(400).json({
        msg: "can not verify this user login again needed",
        status: "failed",
      });
    } catch (err) {
      return res.status(400).json({ msg: err, status: "failed" });
    }
  };
  module.exports= verifyUser