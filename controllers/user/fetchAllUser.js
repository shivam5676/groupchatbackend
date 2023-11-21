
const { Op } = require("sequelize");

const user = require("../../model/user");


const FetchAllUser = (req, res, next) => {
    console.log(req.query);
  
    const search = req.query.search;
    if (search.length <= 1) {
      return res.status(400).json({
        msg: "field can not blank or it should contains atleast 2 character",
      });
    }
    let whereclause = {
      [Op.or]: [{ name: { [Op.substring]: search } }],
    };
    if (search.includes("@")) {
      whereclause = {
        [Op.or]: [{ email: { [Op.substring]: search } }],
      };
    } else if (!isNaN(search)) {
      whereclause = {
        [Op.or]: [{ mobile: { [Op.substring]: search } }],
      };
    }
    console.log(!isNaN(req.query.search));
    user
      .findAll({
        where: whereclause,
        attributes: ["name", "mobile", "id"],
      })
      .then((allUserList) => {
        return res.status(201).json(allUserList);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  module.exports= FetchAllUser